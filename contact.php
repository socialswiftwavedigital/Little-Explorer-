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

$to          = 'Little.explorer904@gmail.com';
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

if (mail($to, $mail_subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not send email']);
}
