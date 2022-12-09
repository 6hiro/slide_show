<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <head prefix="og: https://ogp.me/ns#" >

        <meta property="og:title" content="Vlides">
        <meta property="og:description" content="Slides With Voice">
        <meta property="og:image" content="https://vlides.com/images/LogoOGP.png">
        <meta property="og:image:secure_url" content="https://vlides.com/images/LogoOGP.png">
        <meta property="og:url" content="https://vlides.com">
        <meta property="og:site_name" content="Vlides">
        <meta property="og:image:width" content="300">
        <meta property="og:image:height" content="300">
        <meta name="twitter:title" content="Vlides">
        <meta name="twitter:description" content="Slides With Voice">
        <meta name="twitter:image" content="https://vlides.com/images/LogoOGP.png">
        <meta name="twitter:card" content="summary">
        {{-- <meta name="twitter:site" content="@Vlides_"> --}}

        <title>Vlides</title>

        {{-- react に変更があったとき自動で --}}
        {{-- @viteReactRefresh

        @vite([
            // 'resources/sass/app.scss', 
            'resources/ts/index.tsx'
        ]) --}}
        
        <link rel="icon" href="/images/Logo.png">

        <link rel="stylesheet" href="/css/index.css">
    </head>

    <body class="">
        <div id="app"></div>
    </body>

    <script src="/js/index.js"></script>
</html>