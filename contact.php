<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://littleexplorersworld.com');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit;
}

$name    = strip_tags(trim($_POST['name']    ?? ''));
$phone   = strip_tags(trim($_POST['phone']   ?? ''));
$email   = filter_var(trim($_POST['email']   ?? ''), FILTER_VALIDATE_EMAIL);
$subject = strip_tags(trim($_POST['subject'] ?? ''));
$message = strip_tags(trim($_POST['message'] ?? ''));

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Required fields missing']);
    exit;
}

$subject_labels = [
    'booking'     => 'Play Zone Booking',
    'birthday'    => 'Birthday Party Inquiry',
    'partnership' => 'Partnership Inquiry',
    'feedback'    => 'Feedback / Complaint',
    'general'     => 'General Question',
];
$subject_label = $subject_labels[$subject] ?? 'Website Inquiry';

$to          = 'social.swiftwavedigital@gmail.com';
$mail_subject = '[Little Explorers] ' . $subject_label . ' from ' . $name;

$body  = "You have a new message from the Little Explorers World website.\n\n";
$body .= "Name:    $name\n";
$body .= "Phone:   " . ($phone ?: 'Not provided') . "\n";
$body .= "Email:   $email\n";
$body .= "Subject: $subject_label\n";
$body .= "\nMessage:\n$message\n";
$body .= "\n--\nSent via littleexplorersworld.com/contact\n";

$headers  = "From: website@littleexplorersworld.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Forward the inquiry to the CRM inbox. Failures are ignored so the form
// (and the email below) keep working even if the CRM is down.
if (function_exists('curl_init')) {
    $ch = curl_init('https://crm.littleexplorersworld.com/inquiry.php');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query([
            'name'    => $name,
            'phone'   => $phone,
            'email'   => $email,
            'subject' => $subject,
            'message' => $message,
            'ip'      => $_SERVER['REMOTE_ADDR'] ?? '',
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_TIMEOUT        => 4,
    ]);
    @curl_exec($ch);
    curl_close($ch);
}

if (mail($to, $mail_subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not send email']);
}
