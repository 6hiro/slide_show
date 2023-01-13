<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb# website: https://ogp.me/ns/website#">
    <head >
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Vlides / Link Card</title>

        <style>
            .link-box{
                text-decoration: none;
                word-break: break-all;
                align-items: center;
                border: 1px solid #f3f3f3;
                box-shadow: 0 0 8px -5px rgb(0 0 0 / 47%);
                border-radius: 6px;
                display: flex;
                justify-content: space-between;
                justify-content: flex-end;
                position: relative;
                overflow: hidden;
            }
            .link-box:hover{
                background-color:#f3f3f3;
                -webkit-transition:background-color .35s;
                transition:background-color .35s;
            }
            .link-box .img-box{
                padding: 10px
            }
            .link-box .img-box img {
                border-left: 1px solid rgba(0, 0, 0, 0.12);
                flex-shrink: 0;
                height: 110px;
                width: 110px;
                object-fit: cover;
                aspect-ratio: auto 220 / 110;
            }
            .link-box .text-box {
                padding: 5px 10px;
                width: calc(100% - 135px);
            }
            .title {
                font-size: 16px;
            }
            .site-name {
                font-size: 12px;
            }
        </style>
    </head>

    <body class="">
        <a href={{isset($url) ? $url : "/" }} style="text-decoration: none;" target="_blank" rel="noopener noreferrer">
            <div class="link-box">
                <div class="img-box">
                    @if(isset($og_image))
                        <img 
                            src={{"$og_image"}} 
                            alt={{
                                isset($og_title) 
                                    ? "$og_title"
                                    : (isset($title) ? "$title" : "link-card")
                            }}>
                    @else
                        <div></div>
                    @endif
                </div>
                <div class="text-box">
                    <p class="title">
                        @if( isset($og_title) )
                            {{ $og_title }}
                        @else
                            @if( isset($title) )
                                {{ $title }}
                            @endif
                        @endif
                    </p>
                    <p class="site-name">
                        @if( isset($og_site_name) )
                            {{ $og_site_name }}
                        @else
                        @endif
                    </p>
                </div>
            </div>
        </a>
    </body>

</html>