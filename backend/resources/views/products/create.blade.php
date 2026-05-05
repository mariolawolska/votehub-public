@extends('layouts.app')

@section('content')

<div class="w-[60%] mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg" x-data>
    <h1 class="text-2xl font-bold mb-6">Create product</h1>

    <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf

        {{-- TITLE --}}
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input 
                type="text" 
                name="title" 
                id="title"
                class="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500"
                required
            >
            @error('title')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- DESCRIPTION --}}
        <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
                name="description" 
                id="description"
                class="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500"
                required
            ></textarea>
            @error('description')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- CATEGORIES DROPDOWN --}}
        <div>
            <label for="categories" class="block text-sm font-medium text-gray-700">Categories</label>

            <select 
                name="categories[]" 
                id="categories" 
                multiple
                class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm 
                       bg-white text-gray-700
                       focus:border-indigo-500 focus:ring-indigo-500"
            >
                @foreach($categories as $category)
                    <option value="{{ $category->id }}">
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>

            <p class="text-xs text-gray-500 mt-1">
                Hold CTRL (Windows) or CMD (Mac) to select multiple categories.
            </p>

            @error('categories')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- AVATAR --}}
        <div>
            <label class="block text-sm font-medium text-gray-700">Avatar</label>
            <input 
                type="file" 
                name="submitterAvatarUrl"
                class="mt-1 block w-full text-sm text-gray-700"
            >
            @error('submitterAvatarUrl')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- PRODUCT IMAGE --}}
        <div>
            <label class="block text-sm font-medium text-gray-700">Product Image</label>
            <input 
                type="file" 
                name="productImageUrl"
                class="mt-1 block w-full text-sm text-gray-700"
            >
            @error('productImageUrl')
                <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- SUBMIT BUTTON --}}
        <button type="submit"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                       bg-emerald-300 text-white hover:bg-emerald-400 active:bg-emerald-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-1
                       transition duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M17 16h2a2 2 0 002-2V6a2 2 0 00-2-2h-2M7 16h10M7 16v4a2 2 0 002 2h6a2 2 0 002-2v-4M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12" />
            </svg>
            Save
        </button>
    </form>
</div>

@endsection
