import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Objetivos = () => {
    const router = useRouter();
    const data = useLocalSearchParams();

    const [pesoObjetivo, setPesoObjetivo] = useState(String(Number(data.peso) || '0'));
    const [TMB, setTMB] = useState(0);
    const [actividad, setActividad] = useState('1.55');
    const [tipoObjetivo, setTipoObjetivo] = useState('ganar_musculo'); // Valor por defecto

    // Opciones de tipo de objetivo
    const opcionesObjetivo = [
        { valor: 'perder_grasa', etiqueta: 'Perder Grasa', descripcion: 'Definición muscular' },
        { valor: 'ganar_musculo', etiqueta: 'Ganar Músculo', descripcion: 'Volumen y fuerza' },
        { valor: 'mantener', etiqueta: 'Mantener', descripcion: 'Peso actual' },
    ];

    // Opciones de actividad como objetos con valor y etiqueta
    const opcionesActividad = [
        { valor: '1.2', etiqueta: 'Sedentario', descripcion: 'poco o ningún ejercicio' },
        { valor: '1.375', etiqueta: 'Ligero', descripcion: 'ejercicio 1-3 días/semana' },
        { valor: '1.55', etiqueta: 'Moderado', descripcion: 'ejercicio 3-5 días/semana' },
        { valor: '1.725', etiqueta: 'Activo', descripcion: 'ejercicio 6-7 días/semana' },
        { valor: '1.9', etiqueta: 'Muy Activo', descripcion: 'ejercicio diario intenso' },
    ];

    // Cálculo de TMB
    const calcularTMB = () => {
        const estaturaCM = Number(data.estatura);
        const pesoKG = Number(data.peso);
        const edadNum = Number(data.edad);
        const genero = data.genero;

        let tmbCalculado;

        if (genero === 'Masculino') {
            tmbCalculado = (10 * pesoKG) + (6.25 * estaturaCM) - (5 * edadNum) + 5;
        } else if (genero === 'Femenino') {
            tmbCalculado = (10 * pesoKG) + (6.25 * estaturaCM) - (5 * edadNum) - 161;
        } else {
            tmbCalculado = (10 * pesoKG) + (6.25 * estaturaCM) - (5 * edadNum) - 78;
        }

        setTMB(Math.round(tmbCalculado));
    };

    useEffect(() => {
        calcularTMB();
    }, [data]);

    // Cálculo de Calorías Meta Diarias con ajuste según tipo de objetivo
    const caloriasMeta = useMemo(() => {
        if (TMB === 0 || !pesoObjetivo) return 0;

        const factor = Number(actividad);
        const pesoActual = Number(data.peso);
        const objetivo = Number(pesoObjetivo);
        
        let tmt = TMB * factor;
        let ajusteCalorico = 0;

        // Ajuste basado en el tipo de objetivo seleccionado
        switch(tipoObjetivo) {
            case 'perder_grasa':
                ajusteCalorico = -500; // Déficit para pérdida de grasa
                break;
            case 'ganar_musculo':
                ajusteCalorico = 500; // Superávit para ganancia muscular
                break;
            case 'mantener':
                ajusteCalorico = 0; // Mantenimiento
                break;
            default:
                ajusteCalorico = 0;
        }

        // Si el usuario ingresa un peso objetivo específico, priorizar ese cálculo
        if (objetivo < pesoActual && tipoObjetivo !== 'perder_grasa') {
            ajusteCalorico = -300; // Ajuste conservador si el peso objetivo es menor
        } else if (objetivo > pesoActual && tipoObjetivo !== 'ganar_musculo') {
            ajusteCalorico = 300; // Ajuste conservador si el peso objetivo es mayor
        }
        
        const metaCalculada = tmt + ajusteCalorico;
        return Math.max(1200, Math.round(metaCalculada));
    }, [TMB, actividad, pesoObjetivo, data.peso, tipoObjetivo]);

    const handleSiguiente = () => {
        console.log('Enviando datos:', { 
            ...data, 
            pesoObjetivo, 
            actividad, 
            TMB,
            caloriasMeta,
            tipoObjetivo
        });
        
        router.push({
            pathname: '/restricciones',
            params: { 
                ...data, 
                pesoObjetivo: pesoObjetivo,
                actividad: actividad,  
                TMB: TMB.toString(),
                caloriasMeta: caloriasMeta.toString(),
                tipoObjetivo: tipoObjetivo
            }
        });
    };

    return(
        <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }} contentContainerStyle={styles.scrollContent} keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.iconPlaceholder}>
                        <Text style={styles.iconText}>🎯</Text>
                    </View>
                    <Text style={styles.title}>Establece tus Metas</Text>
                    <View style={styles.stepIndicators}>
                        <View style={[styles.stepDot, styles.activeDot]} />
                        <View style={[styles.stepDot, styles.activeDot]} />
                        <View style={styles.stepDot} />
                    </View>
                </View>

                <Text style={styles.inputLabel}>Peso Objetivo (kg)</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setPesoObjetivo(text.replace(/[^0-9]/g, ''))}
                    value={pesoObjetivo}
                    keyboardType="numeric"
                    placeholder="Ej: 75"
                />

                {/* Selector de Tipo de Objetivo */}
                <Text style={styles.inputLabel}>Tu Objetivo Principal</Text>
                <View style={styles.chipsContainer}>
                    {opcionesObjetivo.map((opcion) => (
                        <TouchableOpacity
                            key={opcion.valor}
                            style={[
                                styles.chip,
                                tipoObjetivo === opcion.valor && styles.chipSeleccionado
                            ]}
                            onPress={() => setTipoObjetivo(opcion.valor)}
                        >
                            <Text style={[
                                styles.chipTexto,
                                tipoObjetivo === opcion.valor && styles.chipTextoSeleccionado
                            ]}>
                                {opcion.etiqueta}
                            </Text>
                            <Text style={[
                                styles.chipDescripcion,
                                tipoObjetivo === opcion.valor && styles.chipDescripcionSeleccionada
                            ]}>
                                {opcion.descripcion}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Selector de Actividad con diseño de chips */}
                <Text style={styles.inputLabel}>Nivel de Actividad Física</Text>
                <View style={styles.chipsContainer}>
                    {opcionesActividad.map((opcion) => (
                        <TouchableOpacity
                            key={opcion.valor}
                            style={[
                                styles.chip,
                                actividad === opcion.valor && styles.chipSeleccionado
                            ]}
                            onPress={() => setActividad(opcion.valor)}
                        >
                            <Text style={[
                                styles.chipTexto,
                                actividad === opcion.valor && styles.chipTextoSeleccionado
                            ]}>
                                {opcion.etiqueta}
                            </Text>
                            <Text style={[
                                styles.chipDescripcion,
                                actividad === opcion.valor && styles.chipDescripcionSeleccionada
                            ]}>
                                {opcion.descripcion}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.TextSecondary}>TMB Calculada (Kcal): {TMB}</Text>
                <Text style={[styles.TextSecondary, { marginTop: 15 }]}>
                    Calorías Diarias Necesarias para la Meta:
                </Text>
                <Text style={styles.TextMeta}>{caloriasMeta} Kcal</Text>

                <TouchableOpacity style={styles.button} onPress={handleSiguiente}>
                    <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
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
        padding: 30,
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
        fontSize: 24,
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
    inputLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
        marginTop: 15,
        marginBottom: 10,
    },
    input: {
        height: 56,
        borderColor: '#eee',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 17,
        backgroundColor: '#f9f9f9',
    },
    
    // Estilos para los chips de actividad
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    chip: {
        width: '48%',
        paddingVertical: 14,
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
    chipDescripcion: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginTop: 4,
    },
    chipDescripcionSeleccionada: {
        color: 'rgba(255,255,255,0.8)',
    },

    button: {
        marginTop: 30,
        backgroundColor: '#00c39a',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 19,
        fontWeight: 'bold',
    },
    TextSecondary: {
        marginTop: 20,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
    TextMeta: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00c39a',
        textAlign: 'center',
    }
});

export default Objetivos;