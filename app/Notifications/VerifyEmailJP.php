<?php
// https://loop-never-ends.com/laravel-mail-lang-ja/
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Auth\Notifications\VerifyEmail;

class VerifyEmailJP extends VerifyEmail
{
    // オーバーライド
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $verificationUrl);
        }

        return (new MailMessage)
            ->subject(Lang::get('本登録のご案内メール'))
            ->line(Lang::get('下記のボタンをクリックして、本登録を完了してください。'))
            ->action(Lang::get('メール認証'), $verificationUrl)
            ->line(Lang::get('アカウント作成にお心当たりがない場合は、このメールを無視してください。'));
    }
}