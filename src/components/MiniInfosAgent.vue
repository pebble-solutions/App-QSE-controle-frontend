<template>
    <div class="col-12">
      <div class="rounded shadow-sm d-flex bg-white align-items-center p-2">
        <div style="height: calc(3em + 1rem); width: 70px; margin-right: 7px;">
          <img src="../assets/profilePicture.webp" class="rounded"
            style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div>
          <div>
            <div class="fw-bold">{{ cacheNom(idCible) }}</div>
            <div>0675543451</div>
            <div>zhatar@fer-expert.fr</div>
          </div>
        </div>
        <div style="margin-left: auto;">
          <div style="text-align: right; font-size: 14px;">#{{ matricule(idCible) }}</div>
          <div style="text-align: right; font-size: 14px;">ID : {{ idCible }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  export default {
    
    props: { 
        idCible: {
            type: String,
            required: false,
        }
        },
    computed: {

      ...mapState(['listActifs']),
    
    },

    methods: {
      cacheNom(id) {
        let item = this.listActifs.find((actif)=> actif.id == id);
        return item ? item.cache_nom : '';
      },
      matricule(id) {
        let item = this.listActifs.find((actif)=> actif.id == id);
        return item ? item.matricule : '';
      },


      
    },
  };
  </script>

  // /api/structurePersonnel/GET/{id}

