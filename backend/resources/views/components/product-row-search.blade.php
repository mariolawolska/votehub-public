<tr>
    <td x-html="highlight(item.title)" class="px-4 py-3 font-medium"></td>
    <td class="px-4 py-3 text-gray-600 relative">
        <div 
            x-data="truncateDescription(item.description ?? '', 30)"
            @mouseenter="open = true"
            @mouseleave="open = false"
            @click="open = !open"
            class="cursor-pointer"
            >
            <!-- Truncated text with highlight -->
            <span x-html="highlight(truncated)"></span>

            <!-- Full text tooltip (desktop) -->
            <div 
                x-show="open && full.length > 50"
                class="hidden md:block absolute left-0 top-full mt-1 p-2 max-w-xs 
                bg-gray-100 border border-gray-300 rounded shadow-lg 
                text-sm z-10 pointer-events-none"
                x-cloak
                >
                <span x-html="highlight(full)"></span>
            </div>

            <!-- Full text expanded (mobile) -->
            <div 
                x-show="open && full.length > 50"
                class="block md:hidden mt-1 text-sm text-gray-700"
                x-cloak
                >
                <span x-html="highlight(full)"></span>
            </div>
        </div>
    </td>

    <td class="px-4 py-2">
        <button 
            @click="$dispatch('open-comments', item.id)"
            class="text-indigo-600 hover:text-indigo-800 underline"
            >
            View (<span x-text="item.comments_count"></span>)
        </button>

    </td>


    <td x-text="item.votes" class="px-4 py-3 font-medium"></td>
    <td x-text="item.submitterAvatarUrl" class="px-4 py-3 font-medium"></td>
    <td x-text="item.productUrl" class="px-4 py-3 font-medium"></td>

    <td class="px-4 py-3 font-medium">
        <img  x-init="console.log('ITEM:', item)" :src="item.thumbnail_url" class="w-20 h-20 object-cover rounded">

    </td>

    <td class="px-4 py-3 font-medium">
        <div class="flex flex-wrap gap-1">
            <template x-for="cat in item.categories" :key="cat.id">
                <span class="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700"
                      x-text="cat.name"></span>
            </template>
        </div>
    </td>

    <td class="px-4 py-3 font-medium">
        <button 
            class="px-4 py-2 bg-yellow-300 text-white font-medium rounded-lg
            hover:bg-yellow-400 active:bg-yellow-500
            focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2
            transition duration-200"
            @click.prevent="vote(item.id)"
            >
            Vote
        </button>
    </td>

    <td class="px-4 py-3 font-medium">
        <a :href="`/products/${item.id}/edit`" class="px-4 py-2 bg-blue-300 text-white font-medium rounded-lg
           hover:bg-blue-400 active:bg-blue-500
           focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2
           transition duration-200">Edit</a>
    </td>

    <td class="px-4 py-3 font-medium">
        <form :action="`/products/${item.id}`" method="POST"
              @submit.prevent="if(confirm('Are you sure?')) $event.target.submit()">

            <input type="hidden" name="_token" value="{{ csrf_token() }}">
            <input type="hidden" name="_method" value="DELETE">

            <button
                type="submit"
                class="px-4 py-2 bg-red-300 text-white font-medium rounded-lg 
                hover:bg-red-700 active:bg-red-400 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                transition duration-200">
                Delete
            </button>
        </form>
    </td>
</tr>
