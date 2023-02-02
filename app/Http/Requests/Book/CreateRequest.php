<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class CreateRequest extends FormRequest
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
            'title' => 'required|max:50',
            'is_public' => 'required|boolean',
        ];
    }

    public function title(): string
    {
        // 入力値の取得
        // $request->input('data', 'デフォルト値');
        return $this->input('title');
    }
    public function is_public(): bool
    {
        return $this->input('is_public', false);
    }
}
