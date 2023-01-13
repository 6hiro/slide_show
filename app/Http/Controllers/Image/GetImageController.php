<?php

namespace App\Http\Controllers\Image;

use App\Http\Controllers\Controller;
use App\Services\VlideService;
use Illuminate\Http\Request;
use App\Http\Resources\VlideResource;

use DateTime;
use DateTimeZone;
use Illuminate\Support\Facades\Storage;


class GetImageController extends Controller
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

        $image =  Storage::disk('s3')->get('public/images/'.$filename);
        $filesize = Storage::disk('s3')->size('public/images/'.$filename);
        

        function get_content_type($filename)
        {
            $array = explode('.', $filename);
            $extension = $array[count($array)-1];
            
            if($extension === "jpeg"){
                return "image/jpeg";
            }else if($extension === "png"){
                return "image/png";
            }else if($extension === "gif"){
                return "image/gif";
            }else{ // jpg
                return "image/jpeg";
            }
        }

        $headers = [
            'Content-Length' => $filesize,
            'Content-Type' => get_content_type($filename),
            'Accept-Ranges' => 'bytes'
        ];

        return response()->make($image, 200, $headers);

    }
}
