<?php

namespace App\Http\Controllers\Embed;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmbedController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $url = $request->url;
        // return file_get_contents($url);
        $doc = new \DOMDocument();
        // $dom = new DOMDocument('1.0', 'UTF-8');
        // libxml_use_internal_errors(true);
        // @$doc->loadHTMLFile($url);
        // HTMLとして正しくない箇所が一か所でもあると、処理上は問題無くてもWarningを発生するので @ をつける
        // 文字化けする場合があるので mb_convert_encoding(file_get_contents($url), 'HTML-ENTITIES', 'UTF-8')
        @$html = mb_convert_encoding(file_get_contents($url), 'HTML-ENTITIES', 'UTF-8');
        if(!$html) {
            return response()->json([
                "url" => "",
                "title" => "",
                "og_title" => "",
                "og_image" => "",
                "og_site_name" => "",
                "og_description" => "",
            ]);
        }
        @$doc->loadHTML($html);
        $xpath = new \DOMXPath($doc);
        $node_title = $xpath->query('//title');
        $node_og_title = $xpath->query('//meta[@property="og:title"]/@content');
        $node_og_image = $xpath->query('//meta[@property="og:image"]/@content');
        $node_site_name = $xpath->query('//meta[@property="og:site_name"]/@content');
        $node_description = $xpath->query('//meta[@property="og:description"]/@content');
        
        $node_twitter_title = $xpath->query('//meta[@name="twitter:title"]/@content');
        $node_twitter_image = $xpath->query('//meta[@name="twitter:image"]/@content');
        $node_twitter_site = $xpath->query('//meta[@name="twitter:site"]/@content');
        $node_twitter_description = $xpath->query('//meta[@name="twitter:description"]/@content');
        
        $node_site_img= $xpath->query('//link[@rel="apple-touch-icon"]/@href');
        $site_img = $node_site_img->length > 0 ? $node_site_img->item(0)->nodeValue : '';
        // $twitter_title = $node_twitter_title->length > 0 ? $node_twitter_title->item(0)->nodeValue : '';
        // $twitter_image = $node_twitter_image->length > 0 ? $node_twitter_image->item(0)->nodeValue : '';
        // $twitte_site = $node_twitter_site->length > 0 ? $node_twitter_site->item(0)->nodeValue : '';
        // $twitte_description = $node_twitter_description->length > 0 ? $node_twitter_description->item(0)->nodeValue : '';

        $title = $node_title->length > 0 ? $node_title->item(0)->nodeValue : '';
        $og_title = $node_og_title->length > 0 ? $node_og_title->item(0)->nodeValue : '';
        $og_image = $node_og_image->length > 0 ? $node_og_image->item(0)->nodeValue : '';
        $og_site_name = $node_site_name->length > 0 ? $node_site_name->item(0)->nodeValue : '';
        $og_description = $node_description->length > 0 ? $node_description->item(0)->nodeValue : '';
        
        
        // $query = '//*/meta[starts-with(@name, \'twitter:\')]';
        // $twitters = $xpath->query($query);
        // var_dump($twitters);

        return response()->json([
            // "xpath"=>$xpath->query('//meta[@name="twitter:title"]/@content')->length ,
            "url" => $url,
            "title" => $title,
            "og_title" => $og_title,
            "site_img" => $node_site_img,
            // "twitter_title" => $twitter_title,
            // "twitter_image" => $twitter_image,
            // "twitte_site" => $twitte_site,
            "og_image" => $og_image,
            "og_site_name" => $og_site_name,
            "og_description" => $og_description,
        ]);
    }
}
