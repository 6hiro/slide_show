<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
// use App\Services\VlideService;
use Illuminate\Http\Request;
use App\Models\Images;
// use App\Http\Resources\VlideResource;



class ImagesUploadController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)  // Single Action Controller
    {
        $validator = Valiator::make($request->all(),
            [
                'images' => 'required|array|max:6',
                'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048' // 2mb
            ]
        );

        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }
        if($request->has('images'))
        {
            foreach($request->file('images') as $image){
                $filename = Str::random(32).".".$image->getClientOriginalExtension();
                $image->move('uploads/', $filename);
                $imageModel = Image::create([
                    'image_name' => $file_name
                ]);
                // $target->images()->attach($imageModel->id);
            }
            
        }
        else
        {
            return response()->json([
                'status '=> 419,
                'message' => 'Failed image(s) not uploaded',
                'validation_errors' => $validator->messages(),
            ]);
        }
    }
}
