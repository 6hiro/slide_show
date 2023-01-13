<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Vlide\UploadAudioRequest;
use App\Services\VlideService;
use Illuminate\Support\Str;
use App\Models\Vlide;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UploadAudioController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(UploadAudioRequest $request, VlideService $vlideService)
    {
        $vlideId = $request->route('vlideId');
        $audio = $request->file('audio');

        $filename = Str::random(32).".".$audio->getClientOriginalExtension();
        
        $target =  DB::transaction(function () use($vlideId, $audio, $filename) {
            $vlide = Vlide::where('id', $vlideId)->firstOrFail();

            if($vlide->audio_file_name){
                // $filePath = 'public/audios/'.$vlide->audio_file_name;
                // $filePath = 'audios/'.$vlide->audio_file_name;
                $filePath = 'public/audios/'.$vlide->audio_file_name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                    Storage::disk('s3')->delete($filePath);
                }
            }

            // Storage::putFileAs('public/audios', $audio, $filename);
            $path = Storage::disk('s3')->putFileAs('public/audios', $audio, $filename);
            // $path = Storage::disk('s3')->putFile('audios', $audio, 'public');
            // $path = Storage::disk('s3')->put('audios', $audio, 'public');
            $vlide->audio_file_name = $filename;
            $vlide->save();

            return $vlide->audio_file_name;
            // return $path;
        });

        return response()->json([
            // 'audio'=> $request->file('audio')->getClientOriginalName(),
            'filePath' => $target,
            // 'filePath'=>Storage::disk('s3')->url($target)
            // Storage::disk('s3')->url('public/audios/'.$this->audio_file_name)
        ], 201);


        // dd($request->file('upload')->getMimeType());

        // $file = $request->file('uploadFile');
        // $fileName = $file->getClientOriginalName(); // ファイル名取得
        // $fileExt = $file->getClientOriginalExtension(); // 拡張子取得
        // $fileSize = $file->getClientSize(); // ファイルサイズ取得

    }
}
