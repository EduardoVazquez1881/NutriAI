import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const restricciones = () => {
    const router = useRouter();
    const data = useLocalSearchParams();

    console.log('Datos recibidos en restricciones:', data);

    // Estados para alergias
    const [alergias, setAlergias] = useState({
        nueces: false,
        lacteos: false,
        gluten: false,
        mariscos: false,
        huevos: false,
        soja: false,
        pescado: false
    });

    // Estados para restricciones alimentarias
    const [restricciones, setRestricciones] = useState({
        vegetariano: false,
        vegano: false,
        keto: false,
        paleo: false,
        sinAzucar: false,
        bajoSodio: false
    });

    // Función para toggle de alergias
    const toggleAlergia = (alergia: keyof typeof alergias) => {
        setAlergias(prev => ({
            ...prev,
            [alergia]: !prev[alergia]
        }));
    };

    // Función para toggle de restricciones
    const toggleRestriccion = (restriccion: keyof typeof restricciones) => {
        setRestricciones(prev => ({
            ...prev,
            [restriccion]: !prev[restriccion]
        }));
    };

    const handleAnterior = () => {
        router.push({
            pathname: '/objetivos',
            params: { ...data,      
        } as any });
    };

    const handleSiguiente = () => {
        // Preparar datos para enviar
        const alergiasSeleccionadas = Object.entries(alergias)
            .filter(([_, selected]) => selected)
            .map(([key, _]) => key);

        const restriccionesSeleccionadas = Object.entries(restricciones)
            .filter(([_, selected]) => selected)
            .map(([key, _]) => key);

        console.log('Datos a enviar desde restricciones:', data);

        console.log('Alergias:', alergiasSeleccionadas);
        console.log('Restricciones:', restriccionesSeleccionadas);

        // Navegar a la siguiente pantalla
        router.push({
            pathname: '/home',
            params: {
                ...data,
                alergias: JSON.stringify(alergiasSeleccionadas),
                restricciones: JSON.stringify(restriccionesSeleccionadas)
            }
        } as any);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }} contentContainerStyle={styles.scrollContent} keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'} bounces={true}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.iconPlaceholder}>
                        <Text style={styles.iconText}>🚫</Text>
                    </View>
                    <Text style={styles.title}>Alergias y Restricciones</Text>
                    <View style={styles.stepIndicators}>
                        <View style={[styles.stepDot, styles.activeDot]} />
                        <View style={[styles.stepDot, styles.activeDot]} />
                        <View style={[styles.stepDot, styles.activeDot]} />
                    </View>
                </View>

                {/* Sección Alergias */}
                <Text style={styles.sectionTitle}>Alergias</Text>
                <View style={styles.chipsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.chip,
                            alergias.nueces && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleAlergia('nueces')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            alergias.nueces && styles.chipTextoSeleccionado
                        ]}>
                            Nueces
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            alergias.lacteos && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleAlergia('lacteos')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            alergias.lacteos && styles.chipTextoSeleccionado
                        ]}>
                            Lácteos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            alergias.gluten && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleAlergia('gluten')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            alergias.gluten && styles.chipTextoSeleccionado
                        ]}>
                            Gluten
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            alergias.mariscos && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleAlergia('mariscos')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            alergias.mariscos && styles.chipTextoSeleccionado
                        ]}>
                            Mariscos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            alergias.huevos && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleAlergia('huevos')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            alergias.huevos && styles.chipTextoSeleccionado
                        ]}>
                            Huevos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            alergias.soja && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleAlergia('soja')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            alergias.soja && styles.chipTextoSeleccionado
                        ]}>
                            Soja
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            alergias.pescado && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleAlergia('pescado')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            alergias.pescado && styles.chipTextoSeleccionado
                        ]}>
                            Pescado
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Sección Restricciones Alimentarias */}
                <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Restricciones Alimentarias</Text>
                <View style={styles.chipsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.chip,
                            restricciones.vegetariano && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleRestriccion('vegetariano')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            restricciones.vegetariano && styles.chipTextoSeleccionado
                        ]}>
                            Vegetariano
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            restricciones.vegano && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleRestriccion('vegano')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            restricciones.vegano && styles.chipTextoSeleccionado
                        ]}>
                            Vegano
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            restricciones.keto && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleRestriccion('keto')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            restricciones.keto && styles.chipTextoSeleccionado
                        ]}>
                            Keto
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            restricciones.paleo && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleRestriccion('paleo')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            restricciones.paleo && styles.chipTextoSeleccionado
                        ]}>
                            Paleo
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            restricciones.sinAzucar && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleRestriccion('sinAzucar')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            restricciones.sinAzucar && styles.chipTextoSeleccionado
                        ]}>
                            Sin azúcar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.chip,
                            restricciones.bajoSodio && styles.chipSeleccionado
                        ]}
                        onPress={() => toggleRestriccion('bajoSodio')}
                    >
                        <Text style={[
                            styles.chipTexto,
                            restricciones.bajoSodio && styles.chipTextoSeleccionado
                        ]}>
                            Bajo en sodio
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Botones de navegación */}
                <View style={styles.botonesContainer}>
                    <TouchableOpacity 
                        style={[styles.boton, styles.botonAnterior]} 
                        onPress={handleAnterior}
                    >
                        <Text style={styles.botonTextoAnterior}>Anterior</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.boton, styles.botonSiguiente]} 
                        onPress={handleSiguiente}
                    >
                        <Text style={styles.botonTextoSiguiente}>Siguiente</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 191, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconText: {
        fontSize: 30,
        color: '#00bfff',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    stepIndicators: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#00bfff',
        width: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    chip: {
        width: '48%',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    chipSeleccionado: {
        backgroundColor: '#00c39a',
        borderColor: '#00c39a',
    },
    chipTexto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    chipTextoSeleccionado: {
        color: 'white',
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
    },
    boton: {
        width: '48%',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonAnterior: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#00c39a',
    },
    botonSiguiente: {
        backgroundColor: '#00c39a',
    },
    botonTextoAnterior: {
        color: '#00c39a',
        fontSize: 18,
        fontWeight: '600',
    },
    botonTextoSiguiente: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default restricciones;