<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb# website: https://ogp.me/ns/website#">
    <head >
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Vlides</title>

        @if( isset($vlide) )
            <meta property="og:type" content="article" />

            <meta property="og:title" content="{{$vlide->title}}">
            <meta property="og:description" content="Slides With Voice">
            {{-- <meta property="og:description" content="{{ preg_match('/-{3}h[1-2]\n([\s\S]*?)-{3}([0-9]{1,2}:)?[0-9]{1,2}\n?/u', $vlide->content, $matches) ? $matches[1] : "Slides With Voice" }}"> --}}
            <meta property="og:url" content={{"https://vlides.com/vlide/".$vlide->id}}>

            <meta name="twitter:title" content="{{$vlide->title}}">
            <meta name="twitter:description" content="Slides With Voice">
            {{-- <meta property="twitter:description" content="{{ preg_match('/-{3}h[1-2]\n([\s\S]*?)-{3}([0-9]{1,2}:)?[0-9]{1,2}\n?/u', $vlide->content, $matches) ? $matches[1] : "Slides With Voice" }}"> --}}

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
        <meta name="twitter:site" content="@Vlides_com">


        {{-- react に変更があったとき自動で --}}
        {{-- @viteReactRefresh

        @vite([
            // 'resources/sass/app.scss', 
            'resources/ts/index.tsx'
        ]) --}}
        
        <link rel="icon" href="/images/Logo.png">
        {{-- <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> --}}
        <link
          rel="alternate icon"
          href="/favicon.ico"
          type="image/png"
          sizes="16x16"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="mask-icon" href="/favicon.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#fff" />

        {{-- <link rel="stylesheet" href="/css/index.css"> --}}

        {{-- https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites --}}
        {{-- <script>
            window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);
        
            t._e = [];
            t.ready = function(f) {
            t._e.push(f);
            };
        
            return t;
            }(document, "script", "twitter-wjs"));
        </script> --}}
        {{-- instagram --}}
        {{-- <script async src="https://www.instagram.com/embed.js"></script> --}}
    </head>

    <body class="">
        {{-- {{ phpinfo();}} --}}

        <div id="app"></div>
        {{-- <script>
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/js/serviceWorker.js') // スコープは、service-worker.js が存在する階層が自動的に設定される
                    .then((reg) => {
                        console.log('サービスワーカーの登録成功', reg.scope)
                        location.reload();
                    })
                    .catch((err) => {
                        console.log('サービスワーカーの登録失敗', err)
                    });
              });
            }
          </script> --}}
    </body>

    {{-- <script src="/js/index.js"></script> --}}
</html>