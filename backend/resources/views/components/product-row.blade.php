<tr x-data="{
    votes: {{ $product->votes }},
    commentsCount: {{ $product->comments_count }},
    submitVote() {
    fetch('{{ route('products.updateVote', $product->id) }}', {
    method: 'POST',
    headers: {
    'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content,
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
    }
    })
    .then(r => r.json())
    .then(data => this.votes = data.votes)
    .catch(err => console.error('Vote error:', err));
    }
    }">
    {{-- TITLE --}}
    <td class="px-4 py-3 font-medium">{{ $product->title }}</td>

    {{-- DESCRIPTION (Alpine truncation) --}}
    <td class="px-4 py-3 text-gray-600 relative">
        <div 
            x-data="truncateDescription({{ json_encode($product->description) }}, 30)"
            @mouseenter="open = true"
            @mouseleave="open = false"
            @click="open = !open"
            class="cursor-pointer"
            >
            <!-- Truncated text -->
            <span x-text="truncated"></span>

            <!-- Full text tooltip (desktop) -->
            <div 
                x-show="open && full.length > 50"
                class="hidden md:block absolute left-0 top-full mt-1 p-2 max-w-xs 
                bg-gray-100 border border-gray-300 rounded shadow-lg 
                text-sm z-10 pointer-events-none"
                x-cloak
                >
                <span x-text="full"></span>
            </div>

            <!-- Full text expanded (mobile) -->
            <div 
                x-show="open && full.length > 50"
                class="block md:hidden mt-1 text-sm text-gray-700"
                x-cloak
                >
                <span x-text="full"></span>
            </div>
        </div>
    </td>




    {{-- COMMENTS --}}
    <td class="px-4 py-2">
        <button 
            x-show="commentsCount > 0"
            @click="$dispatch('open-comments', {{ $product->id }})"
            class="text-indigo-600 hover:text-indigo-800 underline">
            Manage Comments (<span x-text="commentsCount"></span>)
        </button>

        <span x-show="commentsCount === 0" class="text-gray-500">
            No comments
        </span>
    </td>

    {{-- VOTES --}}
    <td class="px-4 py-3 text-center font-semibold" x-text="votes"></td>

    {{-- AVATAR URL --}}
    <td class="px-4 py-3">{{ $product->submitterAvatarUrl }}</td>

    {{-- PRODUCT URL --}}
    <td class="px-4 py-3">{{ $product->url }}</td>

    {{-- THUMBNAIL --}}
    <td class="px-4 py-3">
        <img 
            src="{{ $product->thumbnail_url }}" 
            class="w-20 h-20 object-cover rounded"
            alt="Thumbnail">

    </td>

    {{-- CATEGORIES --}}
    <td class="px-4 py-3">
        <div class="flex flex-wrap gap-1">
            @foreach($product->categories as $category)
            <span class="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700">
                {{ $category->name }}
            </span>
            @endforeach
        </div>
    </td>

    {{-- VOTE BUTTON --}}
    <td class="px-4 py-3">
        <button @click.prevent="submitVote()" 
                 class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
                 bg-blue-300 text-white hover:bg-blue-400 active:bg-blue-500
                 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1
                 transition duration-200">
            Vote
        </button>
    </td>

    {{-- EDIT --}}
    <td class="px-4 py-3">
        <a href="{{ route('products.edit', $product->id) }}"
           class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
           bg-amber-300 text-white hover:bg-amber-400 active:bg-amber-500
           focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-1
           transition duration-200">
            Edit
        </a>
    </td>

    {{-- DELETE --}}
    <td class="px-4 py-3">
        <form action="{{ route('products.destroy', $product->id) }}" method="POST"
              onsubmit="return confirm('Are you sure?')">
            @csrf
            @method('DELETE')
            <button type="submit"
                    class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
                    bg-rose-300 text-white hover:bg-rose-400 active:bg-rose-500
                    focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-1
                    transition duration-200">
                Delete
            </button>
        </form>
    </td>
</tr>
