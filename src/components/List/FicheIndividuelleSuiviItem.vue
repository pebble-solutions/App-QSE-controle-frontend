<template>
    <div>
        {{ agent.cache_nom }}<span class="fw-lighter ms-1"> #{{ agent.id }}</span>

        <div class="badge-group" v-if="nbHabilitation">
            <span v-for="badge in badges" :key="badge.label" class="badge status-badge" :class="'text-bg-'+badge.style">
                <i class="bi" :class="badge.icon"></i>
                <span class="mx-1">{{ getHabiliationNb(badge.style) }}</span>
                <span class="status-detail">{{ badge.label }}</span>
            </span>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.status-badge .status-detail {
	display: none;
}

.status-badge:hover .status-detail {
	display: inline;
}

.badge-group {
    display: flex;
    align-items: center;
    
    > .badge {
        border-radius: 0;

        &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
}
</style>


<script>

export default {
    props: {
        agent: Object
    },

    data() {
        return {
            nbHabilitation: 5,
            nbExpire: 1,
            nbSoonExpire: 2,
            badges: [
                {
                    style: "secondary",
                    icon: "bi-calendar2-check-fill",
                    label: "Habilitation"
                },
                {
                    style: "danger",
                    icon: "bi-exclamation-triangle-fill",
                    label: "Expirée"
                },
                {
                    style: "warning",
                    icon: "bi-exclamation-triangle-fill",
                    label: "Expire dans 1 mois"
                }
            ]
        }
    },

    methods: {
        getHabiliationNb(badgeStyle) {
            let dataNb;

            switch (badgeStyle) {
                case "danger":
                    dataNb = this.nbExpire;
                    break;

                case "warning":
                    dataNb = this.nbSoonExpire;
                    break;
            
                default:
                    dataNb = this.nbHabilitation;
                    break;
            }

            return dataNb;
        }
    },
};

</script>