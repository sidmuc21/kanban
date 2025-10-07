<script>
    const lanes = ["To Do", "Doing", "Done", "Archive"];
  </script>
  
  <main class="min-h-screen bg-indigo-900 p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each lanes as lane}
      <section class="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
        <header class="bg-gray-100 font-lex text-center py-3 font-semibold text-gray-700 border-b border-gray-200">
          {lane}
        </header>
        <div class="flex-1 p-4 space-y-3 min-h-[100px]">
          <p class="text-gray-400 text-sm text-center font-lex">No issues yet</p>
        </div>
      </section>
    {/each}
  </main>
  