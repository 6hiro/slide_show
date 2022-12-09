<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb# website: https://ogp.me/ns/website#"">
    <head >
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">


        @if( isset($vlide) )
            <meta property="og:type" content="article" />

            <meta property="og:title" content="{{$vlide->title}}">
            <meta property="og:description" content="{{$vlide->title}}">
            <meta property="og:url" content={{"https://vlides.com/vlide/".$vlide->id}}>

            <meta name="twitter:title" content="{{$vlide->title}}">
            <meta name="twitter:description" content="{{$vlide->title}}">
            <meta name="twitter:card" content="summary">
        @else
            <meta property="og:type" content="website" >

            <meta property="og:title" content="Vlides">
            <meta property="og:description" content="Slides With Voice">

            <meta property="og:url" content="https://vlides.com">

            
            <meta name="twitter:title" content="Vlides">
            <meta name="twitter:description" content="Slides With Voice">
            <meta name="twitter:card" content="summary">
        @endif

        <meta property="og:site_name" content="Vlides">

        <meta property="og:image" content="https://vlides.com/images/LogoOGP.png">
        <meta property="og:image:secure_url" content="https://vlides.com/images/LogoOGP.png">
        <meta property="og:image:width" content="300">
        <meta property="og:image:height" content="300">

        <meta name="twitter:image" content="https://vlides.com/images/LogoOGP.png">

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