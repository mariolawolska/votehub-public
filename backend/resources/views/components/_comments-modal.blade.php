<div 
    x-cloak
    x-show="show"
    class="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
>
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6"
         @click.outside="show = false">

        <h2 class="text-xl font-semibold mb-4">Comments</h2>

        {{-- LOADING --}}
        <template x-if="loading">
            <p class="text-gray-500">Loading...</p>
        </template>

        {{-- COMMENTS --}}
        <template x-if="!loading">
            <div>
                <template x-for="comment in comments" :key="comment.id">
                    <div class="flex gap-2 items-start p-2">

                        <textarea 
                            class="w-full border rounded p-2"
                            x-model="comment.body"
                        ></textarea>

                        <button 
                           type="button" @click="delete(comment.id)"
                            class="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>

                    </div>
                </template>

                {{-- SAVE + CLOSE --}}
                <div class="mt-4 flex justify-end gap-3">
                    <button 
                        x-show="hasChanges()"
                        @click="save()"
                        class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    >
                        Save
                    </button>

                    <button 
                        @click="show = false"
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </template>

    </div>
</div>
