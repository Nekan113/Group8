const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPremiumConfirmationEmail(toEmail, username, expiryDate) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[Email] RESEND_API_KEY not configured — skipping confirmation email');
        return;
    }

    const formattedExpiry = new Date(expiryDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const recipient = process.env.RESEND_TEST_EMAIL || toEmail;

    const { data, error } = await resend.emails.send({
        from: 'TicTacToang <onboarding@resend.dev>',
        to: recipient,
        subject: '⭐ Premium Subscription Activated — TicTacToang',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
                <h1 style="color: #a78bfa; margin-bottom: 8px;">Welcome to Premium, ${username}!</h1>
                <p style="color: #94a3b8;">Your TicTacToang Premium subscription has been successfully activated.</p>
                <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0 0 8px 0;"><strong style="color: #a78bfa;">Plan:</strong> Monthly Premium</p>
                    <p style="margin: 0 0 8px 0;"><strong style="color: #a78bfa;">Amount Charged:</strong> $10.00 USD</p>
                    <p style="margin: 0;"><strong style="color: #a78bfa;">Valid Until:</strong> ${formattedExpiry}</p>
                </div>
                <p style="color: #94a3b8;">You now have access to:</p>
                <ul style="color: #94a3b8;">
                    <li>Game Replay with full move history</li>
                    <li>Algebraic board notation</li>
                    <li>Pause, Resume, Forward &amp; Backward controls</li>
                </ul>
                <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
                    Thank you for supporting TicTacToang! If you have questions, contact our support team.
                </p>
            </div>
        `,
    });

    if (error) {
        console.error('[Email] Resend API error:', JSON.stringify(error));
    } else {
        console.log('[Email] Sent successfully to', toEmail, '| id:', data.id);
    }
}

module.exports = { sendPremiumConfirmationEmail };
