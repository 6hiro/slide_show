<?php

namespace App\Http\Requests\Clip;

use Illuminate\Foundation\Http\FormRequest;

class ReplyRequest extends FormRequest
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
            'content' => 'required|max:400',
            // 'quote' => 'required|max:200',
            // 'is_public' => 'required|boolean',
        ];
    }
    public function content(): string
    {
        // $request->input('data', 'デフォルト値');
        return $this->input('content');
    }

}
