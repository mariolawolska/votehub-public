<button 
    type="button"
    @click="deleteComment(comment.id)"
    class="mt-1"
    title="Delete comment"
    >
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="#BC544B"
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="w-6 h-6 hover:stroke-red-400 transition"
        >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
    </svg>
</button>