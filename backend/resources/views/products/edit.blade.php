@extends('layouts.app')

@section('content')
<div class="w-[60%] mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg" x-data>

    <h1 class="text-2xl font-bold mb-6">Edit product</h1>

    <form action="{{ route('products.update', $product->id) }}"
          method="POST"
          enctype="multipart/form-data"
          class="space-y-6">

        @csrf
        @method('PUT')

        {{-- TITLE --}}
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input type="text"
                   name="title"
                   id="title"
                   value="{{ old('title', $product->title) }}"
                   class="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                   required>
            @error('title')
            <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- DESCRIPTION --}}
        <div x-data="{ description: `{{ old('description', $product->description) }}`, open: false }">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>

            <textarea name="description"
                      id="description"
                      x-model="description"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
                      required></textarea>

            <div class="mt-2 p-2 bg-gray-50 rounded text-gray-600 text-sm cursor-pointer border border-gray-200"
                 @click="open = !open">
                <span x-text="open || description.length <= 50 ? description : description.slice(0,50) + '...'"></span>
                <template x-if="description.length > 50">
                    <span class="ml-1 text-blue-500 underline">
                        (<span x-text="open ? 'show less' : 'show more'"></span>)
                    </span>
                </template>
            </div>

            @error('description')
            <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- CATEGORIES --}}
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
                    <option value="{{ $category->id }}"
                        @selected($product->categories->contains($category->id))>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>

            <p class="text-xs text-gray-500 mt-1">
                Przytrzymaj CTRL (Windows) lub CMD (Mac), aby zaznaczyć wiele kategorii.
            </p>

            @error('categories')
            <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- AVATAR --}}
        <div x-data="{ preview: null }">
            <label class="block text-sm font-medium text-gray-700">Avatar</label>

            @if($product->submitterAvatarUrl)
            <img src="{{ asset('storage/' . $product->submitterAvatarUrl) }}"
                 class="w-20 h-20 object-cover rounded mb-2">
            @endif

            <input type="file"
                   name="submitterAvatarUrl"
                   @change="preview = URL.createObjectURL($event.target.files[0])"
                   class="mt-1 p-1 block w-full text-sm text-gray-700">

            <template x-if="preview">
                <img :src="preview" class="w-20 h-20 object-cover rounded mt-2">
            </template>

            @error('submitterAvatarUrl')
            <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- PRODUCT IMAGE --}}
        <div x-data="{ preview: null }">
            <label class="block text-sm font-medium text-gray-700">Product Image</label>

            @if($product->productImageUrl)
            <img src="{{ asset('storage/' . $product->productImageUrl) }}"
                 class="w-32 h-32 object-cover rounded mb-2">
            @endif

            <input type="file"
                   name="productImageUrl"
                   @change="preview = URL.createObjectURL($event.target.files[0])"
                   class="mt-1 block w-full text-sm text-gray-700">

            <template x-if="preview">
                <img :src="preview" class="w-32 h-32 object-cover rounded mt-2">
            </template>

            @error('productImageUrl')
            <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- SUBMIT BUTTON --}}
        <div class="flex justify-end">
            <button type="submit"
                    class="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-2xl
                    bg-emerald-400 text-white hover:bg-emerald-500 active:bg-emerald-600
                    focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1
                    transition duration-200 shadow-md hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M17 16h2a2 2 0 002-2V6a2 2 0 00-2-2h-2M7 16h10M7 16v4a2 2 0 002 2h6a2 2 0 002-2v-4M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12" />
                </svg>
                Update
            </button>
        </div>

    </form>

</div>
@endsection
