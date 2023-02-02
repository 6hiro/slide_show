<?php

namespace App\Http\Requests\Vlide;

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
            'content'=>'nullable|max:8000',
            'tag_list'=>'nullable|array',
            'tag_list.*'=>'string',
            'duration' => 'required|integer|max:1200',
            'is_public' => 'required|boolean',
            
            // 'heading_file_name' = >'',
            // 'images' => 'array|max:6',
            // 'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048' // 2mb
            //
        ];
    }

    public function title(): string
    {
        return $this->input('title');
    }
    public function content(): string
    {
        return $this->input('content');
    }
    public function tag_list()
    {
        return $this->input('tag_list', []);
    }
    public function duration(): int
    {
        return $this->input('duration', 0);
    }
    public function is_public(): bool
    {
        return $this->input('is_public', false);
    }
    // public function images(): array
    // {
    //     return $this->file('images', [])
    // }

    public function messages(){
        return [
            'content.max'  => "8000文字以内",
        ];
    }
}
