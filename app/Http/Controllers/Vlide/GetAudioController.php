<?php
// https://stackoverflow.com/questions/46219606/how-to-set-header-in-laravel-before-firing-a-download
// https://stackoverflow.com/questions/38791635/download-a-file-in-laravel-using-a-url-to-external-resource
// https://stackoverflow.com/questions/48658521/html5-seek-issue-in-chrome
// https://www.petitmonte.com/php/audio_seeking.html
// https://readouble.com/laravel/8.x/ja/responses.html

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use App\Services\VlideService;
use Illuminate\Http\Request;
use App\Http\Resources\VlideResource;

use DateTime;
use DateTimeZone;
use Illuminate\Support\Facades\Storage;


class GetAudioController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)  // Single Action Controller
    {
        $filename = $request->f;
        // $pathToFile = storage_path('app/public')."/audios/" . $filename;   
        // $pathToFile = Storage::disk('s3')->url('public/audios/'.$filename);

        $audio =  Storage::disk('s3')->get('public/audios/'.$filename);
        // $mimeType = Storage::disk('s3')->mimeType($filename);
        $filesize = Storage::disk('s3')->size('public/audios/'.$filename);


        // return $audio;

        // これがないとChrome/Egdeではaudioタグでシークできない
        // header('Accept-Ranges: bytes'); 
        
        $headers = [
            'Content-Length' => $filesize,
            'Content-Type' => 'audio/mpeg',
            'Accept-Ranges' => 'bytes'
        ];

        return response()->make($audio, 200, $headers);

        // $response = response()
        //                 ->file(
        //                     base64_encode($pathToFile), 
        //                     $headers
        //                 );

        return $response;
    }
}
