@extends('layouts.app')

@section('content')

<div 
    class="mx-auto m-10 px-4 py-4" 
    x-data="productSearch()"
    @open-comments.window="openComments($event.detail)"
    >
    {{-- SEARCH BAR --}}
    <div class="mb-4 flex gap-3 max-w-[500px] ml-auto">
        <input 
            type="text" 
            x-model="query"
            @input.debounce.300ms="search()"
            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search by title..."
            >
    </div>

    <a href="{{ route('products.create') }}"
       class="inline-flex items-center gap-2 mb-4 px-4 py-2 px-8 text-sm font-medium rounded-lg
       bg-emerald-300 text-white hover:bg-emerald-400 active:bg-emerald-500
       focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-1
       transition duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add product
    </a>

    @if ($products->count())

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700">Title</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700">Comments</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700">Votes</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700">AvatarUrl</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700">ProductUrl</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700">ProductThumbnail</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-700">Categories</th>
                    <th class="px-4 py-2 text-center font-semibold text-gray-700" colspan="3">Actions</th>
                </tr>
            </thead>

            <tbody x-show="!searching" class="divide-y divide-gray-200 bg-white">
                @foreach ($products as $product)
                <x-product-row :product="$product" />
                @endforeach
            </tbody>

            <tbody x-show="searching" class="divide-y divide-gray-200 bg-white">
                <tr x-show="results.length === 0">
                    <td colspan="10" class="px-4 py-3 text-center text-gray-500">
                        No products found.
                    </td>
                </tr>

                <template x-for="item in results" :key="item.id">
                    @include('components.product-row-search')
                </template>
            </tbody>

        </table>

        <div x-show="!searching" class="pt-2 pb-2 bg-gray-50">
            {{ $products->links() }}
        </div>
    </div>

    @else
    <p class="text-gray-600">No products available.</p>
    @endif


    {{-- ⭐⭐⭐ MODAL ⭐⭐⭐ --}}
    <div 
        x-cloak
        x-show="showCommentsModal"
        :key="modalKey"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        x-transition.opacity
        >
        <div 
            class="w-full md:w-3/5 mx-auto mt-10 p-6 bg-white rounded-xl shadow-2xl border border-gray-200 relative z-[9999]"
            @click.outside="showCommentsModal = false"
            x-transition.opacity
            >

            <h2 class="text-xl font-semibold mb-4 text-gray-800">
                Comments
            </h2>

            {{-- Loading --}}
            <template x-if="loadingComments">
                <div class="py-10 text-center text-gray-500">
                    Loading comments...
                </div>
            </template>

            {{-- Content --}}
            <template x-if="!loadingComments">
                <div>

                    {{-- Search bar --}}
                    <input 
                        type="text"
                        x-model="searchTerm"
                        placeholder="Search comments..."
                        class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                        />

                    {{-- Comments list --}}
                    <div class="space-y-4 max-h-72 overflow-y-auto pr-1">

                        <template 
                            x-for="comment in comments.filter(c => 
                            (c.body ?? '').toLowerCase().includes((searchTerm ?? '').trim().toLowerCase())
                            )" 
                            :key="comment.id"
                            >
                            <div class="bg-gray-100  rounded-lg p-4 flex gap-4">

                                <textarea class="w-full border border-gray-300 rounded-lg p-3 shadow-sm 
                                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition
                                          h-48 resize-none"
                                          x-model="comment.body" >
                                </textarea>

                                <x-trash-button @click="deleteComment(comment.id)" />
                            </div>
                        </template>

                    </div>

                    {{-- Footer buttons --}}
                    <div class="mt-6 flex justify-end gap-3">

                        <button 
                            x-show="hasChanges()"
                            @click="saveAllComments()"
                            class="px-8 py-2 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-800 focus:bg-gray-800 
                            active:bg-black focus:outline-none focus:ring-2
                            focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 mb-4
                            hover:bg-emerald-700 transition"
                            >
                            Save changes
                        </button>

                        <button 
                            @click="showCommentsModal = false"
                            class="px-8 py-2 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-800 focus:bg-gray-800 
                            active:bg-black focus:outline-none focus:ring-2
                            focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 mb-4"
                            >
                            Close
                        </button>

                    </div>

                </div>
            </template>

        </div>
    </div>

</div> 

@endsection
