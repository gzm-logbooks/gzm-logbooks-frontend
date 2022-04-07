<template>
  <div class="grid-cols-3 gap-4 sm:grid">
    <div class="col-span-2">
      <FormulateInput
        type="mood-circle"
        name="mood"
        label="Mood"
        validation="required"
        label-class="hidden"
      />


    </div>

    <div class="flex flex-col space-around">
      <FormulateInput
        type="date"
        name="timestamp"
        label="Date"
        validation="required|after:2000-01-01"
        error-behavior="live"
        input-class="w-full input"
      />

      <FormulateInput
        input-class="w-full input"
        type="textarea"
        name="comment"
        label="Comment"
      />

      <blockquote class="text-sm">
        <p class="mb-3">
          Remember when you feel confused or panicky or stupid, that this is
          only your brain trying to keep you safe. You can think more clearly if
          you reverse the fight, flight or freeze response. This will reconnect
          your thinking brain.
        </p>

        <p class="mb-3">
          When you make a mistake, remember that more new connections are made
          in your brain than when you get it right. Mistakes are good! When you
          make a mistake, imagine the new connections in your brain, like the
          new creases on a scrumpled bit of paper. Then keep trying.
          <em>You are learning!</em>
        </p>
      </blockquote>

      <blockquote class="">
        <p class="mb-3">
          To reconnect your thinking brain, try 5/7 breathing. Breathe in while
          you count to 5, and out while you count to 7. Do this again and again
          until you start to feel calm.
        </p>
      </blockquote>
    </div>
  </div>
</template>
