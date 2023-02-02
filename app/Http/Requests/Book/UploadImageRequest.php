<?php

namespace App\Http\Requests\Book;

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
            'image' => 'required|mimes:jpeg,png,jpg|max:2048' // 2mb
        ];
    }
    public function image()
    {
        // 入力値の取得
        return $this->file('image');
    }
    public function messages(){
        return [
            'image.required'  => '画像を添付してください。',
            "image.mimes" => 'jpeg,png,jpg のいずれかの画像をしてください。'
        ];
    }
}
