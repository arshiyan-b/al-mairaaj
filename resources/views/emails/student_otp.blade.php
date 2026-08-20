<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Registration OTP</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Arial, sans-serif;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:40px 0;">
        <tr>
            <td align="center">

                <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#2c5282; padding:24px 32px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:600;">
                                {{ config('app.name') }}
                            </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:32px;">
                            <h2 style="margin:0 0 12px; color:#1a202c; font-size:20px;">
                                Verify Your Email
                            </h2>
                            <p style="margin:0 0 20px; color:#4a5568; font-size:15px; line-height:1.6;">
                                Thank you for registering with us. Please use the One-Time Password (OTP) below to complete your registration.
                            </p>

                            <!-- OTP Box -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background-color:#ebf4ff; border:1px dashed #2c5282; border-radius:8px; padding:20px;">
                                        <span style="font-size:34px; font-weight:700; letter-spacing:8px; color:#2c5282;">
                                            {{ $otp }}
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:20px 0 0; color:#718096; font-size:13px; line-height:1.6;">
                                This code will expire in <strong>10 minutes</strong>. For your security, please do not share it with anyone.
                            </p>

                            @if(!empty($formattedLink))
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $formattedLink }}"
                                           style="display:inline-block; background-color:#2c5282; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 28px; border-radius:6px;">
                                            Verify Now
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            @endif
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f7fafc; padding:20px 32px; text-align:center; border-top:1px solid #edf2f7;">
                            <p style="margin:0; color:#a0aec0; font-size:12px;">
                                If you didn't request this code, you can safely ignore this email.
                            </p>
                            <p style="margin:8px 0 0; color:#a0aec0; font-size:12px;">
                                &copy; {{ date('Y') }} Noomani Education Hub. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>