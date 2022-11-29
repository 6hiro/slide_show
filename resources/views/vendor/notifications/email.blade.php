@component('mail::message')
{{-- Greeting --}}
@if (! empty($greeting))
# {{ $greeting }}
@else
@if ($level === 'error')
# @lang('Whoops!')
@else
{{-- # @lang('Hello!') --}}
お知らせ
@endif
@endif

{{-- Intro Lines --}}
{{-- @foreach ($introLines as $line)
{{ $line }}
@endforeach --}}
メールアドレスを確認するには、以下のボタンをクリックしてください。

{{-- Action Button --}}
@isset($actionText)
<?php
    $color = match ($level) {
        'success', 'error' => $level,
        default => 'primary',
    };
?>
@component('mail::button', ['url' => $actionUrl, 'color' => $color])
{{-- {{ $actionText }} --}}
メール認証
@endcomponent
@endisset

{{-- Outro Lines --}}
{{-- @foreach ($outroLines as $line)
{{ $line }}
@endforeach --}}

アカウント作成にお心当たりがない場合は、このメールを無視してください。

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
{{-- @lang('Regards')<br> --}}
{{ config('app.name') }}
@endif

{{-- Subcopy --}}
@isset($actionText)
@slot('subcopy')
@lang(
    // "If you're having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    // 'into your web browser:',
    "もし「メール認証」ボタンをクリックしても移動できない場合は、以下のURLを直接ブラウザにコピー＆ペーストしてください。\n",
    [
        'actionText' => $actionText,
    ]
) <span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>
@endslot
@endisset
@endcomponent
