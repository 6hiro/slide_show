<?php

namespace App\Http\Requests\Vlide;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
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
            // 'audio' => 'required|mimes:audio/acc,mp3|max:15360', // 15MB
            'image' => 'required|mimes:jpeg,png,jpg,gif|max:8192' // 8mb
        ];
    }
    public function image()
    {
        // 入力値の取得
        return $this->file('image');
        // return $request->file("audio"),
    }
    // function is_public(): bool
    // {
    //     return $this->input('is_public', false);
    // }

    public function messages(){
        return [
            'image.required'  => '画像を添付してください。',
            "image.mimes" => 'jpeg,png,jpg,gif のいずれかの画像をしてください。'
            // 'image' => '画像のアップロードに失敗しました。',
        ];
    }
}
