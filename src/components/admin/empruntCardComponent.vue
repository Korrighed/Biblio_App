<template>
    <div class="modal-overlay">
        <div class="container">
            <div class="row justify-content-center">
                <button @click="$emit('close')" class="btn-close"></button>
                <div class="row">
                    <div class="card justify-content-between p-0 col-lg-2 col-sm-5" v-for="(livre, index) in filteredItems"
                    :key="index">
                    <div class="row g-0">
                        <div class="col-4">
                            <img :src="livre.image || 'default-cover.jpg'" 
                            class="img-fluid rounded-start ms-1 mt-lg-4"
                            alt="couverture">
                        </div>
                        <div class="col-8 p-0">
                            <div class="card-body">
                                <h5 class="card-title">{{ livre.titre }}</h5>
                                <p class="card-text">Auteur : {{ livre.auteur || "Auteur inconnu" }}</p>
                                <p class="card-text">ISBN : {{ livre.ISBN }}</p>
                                <p class="card-text">État : {{ livre.etat }}</p>
                            </div>
                        </div>
                        <div class="row">
                            <CDatePicker label="Date" class="col-6 sm-col-12" v-model="startEmprunt" locale="fr-FR"/>
                            <CDatePicker label="Date" class="col-6 sm-col-12" v-model="finEmprunt" locale="fr-FR"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #6f4e37 !important;
    color: white !important;
    padding: 20px;
    border-radius: 8px !important;
    max-width: 50%;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
}

.btn-close {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>