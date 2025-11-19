<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST["name"]));
    $email = htmlspecialchars(trim($_POST["email"]));
    $message = htmlspecialchars(trim($_POST["message"]));

    $to = "nick.zastrow@sagenverse.com";
    $subject = "New Contact Form Submission";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "<script>
            alert('Your message has been sent!');
            window.location.href = 'contact.html';
        </script>";
    } else {
        echo "<script>
            alert('There was a problem sending your message. Please try again.');
            window.location.href = 'contact.html';
        </script>";
    }
}
?>
