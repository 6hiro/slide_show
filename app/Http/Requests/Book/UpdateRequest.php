<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
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
            'overview'=>'nullable|max:400',
            'is_public' => 'required|boolean',
            'book_type' => 'required|max:10',
        ];
    }

    public function title(): string
    {
        return $this->input('title');
    }
    public function overview(): string
    {
        return $this->input('overview');
    }
    public function is_public(): bool
    {
        return $this->input('is_public', false);
    }
    public function book_type(): string
    {
        return $this->input('book_type', 'default');
    }

    public function messages(){
        return [
            'overview.max'  => "400文字以内",
        ];
    }
}
