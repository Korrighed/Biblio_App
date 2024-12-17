<template>
<div class="container">
    <div class="row">
        <div class="col-md-4 align-self-start">
            <form action="" class="search-form">
                <div class="form-group has-feedback">
                    <input type="text" @input="search" class="form-control" 
                    name="search" id="search" placeholder="Rechercher un livre ou auteur">
            	</div>
            </form>
        </div>
    </div>
</div>
</template>

<script setup>

const emit = defineEmits(['search']);

const search = (e) => {
    const query = e.target.value.trim();
    emit('search', query);
};


</script>

