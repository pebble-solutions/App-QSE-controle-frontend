<template>
    <h2 class=" m-3">
       John DOE
    </h2>
    
    <div class="card m-4">
                    <h2 class="card-header">Liste des habilitations de John DOE</h2>
                    <table class="table">
                            <thead>
                                <tr >
                                    <th >Nom</th>
                                    <th>Validité ( 3 ans)</th>
                                    <th>Echéance</th>
                                    <th>10 derniers contrôles</th>
                                    <th>Prochain KN sous :</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Habilitation H1</td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 20%;"></div>
                                        </div>
                                    </td>
                                    <td >11.02.2025</td>
                                    <td>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge">S</span>
                                        <span class="badge"></span>
                                        <span class="badge"></span>
                                    </td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 45%;">8 sem</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td >Habilitation H2</td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 80%;">reste 20 sem.</div>
                                        </div>
                                    </td>
                                    <td >20.09.2023</td>
                                    <td>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                    </td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-danger" style="width:85%;">15 jours</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td >Habilitation H3</td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 70%;">reste 9 mois</div>
                                        </div>
                                    </td>
                                    <td >08.01.2024</td>
                                    <td>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-warning me-1">M</span>
                                        <span class="badge bg-warning me-1">M</span>
        
                                        <span class="badge bg-warning me-1">M</span>
                                        <span class="badge bg-success me-1"></span>
                                        <span class="badge bg-success me-1"></span>
                                    </td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 50%;">7 sem.</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td >Habilitation H4</td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 85%;">reste 16 sem.</div>
                                        </div>
                                    </td>
                                    <td >10.08.2023</td>
                                    <td>
                                        <span class="badge bg-warning me-1">M</span>
                                        <span class="badge bg-warning me-1">M</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1">S</span>
                                    </td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-danger" style="width: 90%">10 jours</div>
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td >Habilitation H5</td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 60%;">reste 15 mois</div>
                                        </div>
                                    </td>
                                    <td >27.09.2024</td>
                                    <td>
                                        <span class="badge bg-warning me-1">M</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-success me-1">S</span>
                                        <span class="badge bg-success me-1"></span>
                                        <span class="badge bg-success me-1"></span>
                                        <span class="badge bg-success me-1"></span>
                                    </td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-success" style="width: 25%;">10 sem.</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td >Habilitation H6</td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 25%;"></div>
                                        </div>
                                    </td>
                                    <td >11.02.2025</td>
                                    <td>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge bg-primary me-1">A</span>
                                        <span class="badge">S</span>
                                        <span class="badge"></span>
                                        <span class="badge"></span>
                                    </td>
                                    <td>
                                        <div class="progress" style="height:20px" >
                                            <div class="progress-bar bg-primary" style="width: 45%;">8 sem</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
        <img class="img-fluid" src="../assets/controleHabilitationPersonnel.png" alt="">
    </div>
</template>