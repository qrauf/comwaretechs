<?php

use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

function contactResponse(int $statusCode, string $body, array $headers = []): array
{
    return [
        'statusCode' => $statusCode,
        'headers' => array_merge([
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-store',
        ], $headers),
        'body' => $body,
    ];
}

function contactRedirect(string $status = 'sent'): array
{
    return contactResponse(303, '', ['Location' => "/contact?contact={$status}"]);
}

function main(array $event, object $context): array
{
    $requestMethod = strtoupper((string) ($event['http']['method'] ?? 'POST'));
    if ($requestMethod !== 'POST') {
        return contactResponse(405, 'Method not allowed.');
    }

    $input = $event;
    if (isset($event['body']) && is_string($event['body'])) {
        parse_str($event['body'], $bodyFields);
        $input = array_merge($input, $bodyFields);
    }

    if (!empty($input['_honey'])) {
        return contactRedirect();
    }

    $name = trim((string) ($input['name'] ?? ''));
    $email = trim((string) ($input['email'] ?? ''));
    $message = trim((string) ($input['message'] ?? ''));

    if ($name === '' || strlen($name) > 120 || filter_var($email, FILTER_VALIDATE_EMAIL) === false || strlen($message) < 1 || strlen($message) > 5000) {
        return contactResponse(422, 'Please return to the contact form and check your name, email, and message.');
    }

    $smtpHost = getenv('SMTP_HOST') ?: 'smtpout.secureserver.net';
    $smtpPort = (int) (getenv('SMTP_PORT') ?: 587);
    $smtpUsername = getenv('SMTP_USERNAME') ?: '';
    $smtpPassword = getenv('SMTP_PASSWORD') ?: '';
    $contactTo = getenv('CONTACT_TO') ?: 'contactus@comwaretechs.com';

    if ($smtpUsername === '' || $smtpPassword === '') {
        error_log('Contact form SMTP credentials are not configured.');
        return contactRedirect('error');
    }

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUsername;
        $mail->Password = $smtpPassword;
        $mail->SMTPSecure = $smtpPort === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Timeout = 20;
        $mail->Port = $smtpPort;
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->setFrom($smtpUsername, 'Comware Technologies');
        $mail->addAddress($contactTo);
        $mail->addReplyTo($email, $name);
        $mail->Subject = 'New website inquiry for Comware Technologies';
        $mail->Body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}";

        if (!empty($input['updates'])) {
            $mail->Body .= "\n\nThe visitor requested email updates.";
        }

        $mail->send();
        return contactRedirect();
    } catch (Throwable $error) {
        error_log('Contact form delivery failed: ' . $error->getMessage());
        return contactRedirect('error');
    }
}
