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
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class DeleteAudioController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)
    {
        $vlideId = $request->route('vlideId');
        // $audioId = $request->route('audioId');
        
        if( !$vlideService->checkOwnVlide($request->user()->id, $vlideId) ){
            throw new AccessDeniedException();
        }
        
        $target =  DB::transaction(function () use($vlideId) {
            $vlide = Vlide::where('id', $vlideId)->firstOrFail();

            if($vlide->audio_file_name){
                $filePath = 'public/audios/'.$vlide->audio_file_name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                // if(Storage::exists($filePath)) {
                    // Storage::delete($filePath);
                    Storage::disk('s3')->delete($filePath);

                }
            }
            
            $vlide->audio_file_name = null;
            $vlide->save();

            return $vlideId;
        });

        return response()->json([
        ], 204);
    }
}
