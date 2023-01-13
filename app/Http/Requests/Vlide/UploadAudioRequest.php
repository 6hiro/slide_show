<?php

namespace App\Http\Requests\Vlide;

use Illuminate\Foundation\Http\FormRequest;

class UploadAudioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            // https://stackoverflow.com/questions/36032068/laravel-keep-rejecting-m4a-audio-format-how-to-fix-it
            'audio' => 'required|mimes:m4a,audio/acc,mp3|max:25600', // 25MB

            // 'audio' => 'required|mimes:application/octet-stream,audio/mpeg,mpga,mp3,wav|max:15360', // 15MB
            // 'audio' => 'required|mimes:application/octet-stream,audio/mpeg,mpga,mp3,wav|max:10240', // 1024KB 1MB  １KB=1024バイト
            // 'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048' // 2mb
            // mpeg, mpga, mp3, wav
        ];
    }
    public function audio()
    {
        // 入力値の取得
        return $this->file('audio');
        // return $request->file("audio"),
    }

    public function title(): string
    {
        return $this->input('title');
    }
    public function content(): string
    {
        return $this->input('content');
    }
    public function dutaiton(): int
    {
        return $this->input('duration');
    }

    public function tag_list(): array
    {
        return $this->input('tag_list', []);
    }

    public function is_public(): bool
    {
        return $this->input('is_public', false);
    }

    public function messages(){
        return [
            'audio.required'  => '音声を添付してください。',
        ];
    }
}
