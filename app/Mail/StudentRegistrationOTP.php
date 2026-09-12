<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentRegistrationOTP extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $formattedLink;
    public $verifyLink;
    /**
     * Create a new message instance.
     *
     * @param  string|null  $formattedLink  Link to the in-app OTP entry page (email pre-filled).
     * @param  string|null  $verifyLink  Signed one-click link that verifies the OTP automatically.
     */
    public function __construct($otp, $formattedLink, $verifyLink = null)
    {
        $this->otp = $otp;
        $this->formattedLink = $formattedLink;
        $this->verifyLink = $verifyLink;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
       return new Envelope(
            subject: 'Your Registration OTP Code',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.student_otp',
            with: [
                'otp' => $this->otp,
                'formattedLink' => $this->formattedLink,
                'verifyLink' => $this->verifyLink,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
