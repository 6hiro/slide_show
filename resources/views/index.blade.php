<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Vlides</title>

        {{-- react に変更があったとき自動で --}}
        @viteReactRefresh

        @vite([
            // 'resources/sass/app.scss', 
            'resources/ts/index.tsx'
        ])
        
        <link rel="icon" href="/images/Logo.png">

        {{-- <link rel="stylesheet" href="/css/index.css"> --}}
    </head>

    <body class="">
        <div id="app"></div>
    </body>

    {{-- <script src="/js/index.js"></script> --}}
</html>