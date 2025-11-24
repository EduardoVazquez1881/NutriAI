import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Ingrediente = {
    cantidad: string;
    categoria: string;
    ingrediente: string;
    unidad: string;
};

export default function ViewScreen() {
    const { data } = useLocalSearchParams();
    const router = useRouter();

    let ingredientes: Ingrediente[] = [];

    if (typeof data === 'string') {
        try {
            ingredientes = JSON.parse(data) as Ingrediente[];
        } catch (error) {
            console.error('Error al parsear JSON en view:', error);
        }
    } else if (data) {
        console.warn("El parámetro 'data' no es un string:", data);
    }

    // Agrupar por categoría
    const grupos = ingredientes.reduce((acc: Record<string, Ingrediente[]>, item) => {
        const cat = item.categoria || 'otros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }} contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ingredientes detectados</Text>

            {ingredientes.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No hay datos para mostrar.</Text>
                </View>
            ) : (
                Object.keys(grupos).map((categoria) => (
                    <View key={categoria} style={styles.section}>
                        <Text style={styles.sectionTitle}>{categoria}</Text>
                        {grupos[categoria].map((item, idx) => (
                            <View key={idx} style={styles.itemRow}>
                                <View style={styles.itemLeft}>
                                    <Text style={styles.itemName}>{item.ingrediente}</Text>
                                    <Text style={styles.itemCategory}>{item.unidad}</Text>
                                </View>
                                <View style={styles.itemRight}>
                                    <Text style={styles.itemAmount}>{item.cantidad} {item.unidad}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))
            )}

            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
    },
    section: {
        width: '100%',
        maxWidth: 520,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    sectionTitle: {
        textTransform: 'capitalize',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        color: '#333',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.03)',
    },
    itemLeft: {
        flex: 1,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    itemCategory: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    itemRight: {
        marginLeft: 12,
        alignItems: 'flex-end',
    },
    itemAmount: {
        fontSize: 14,
        fontWeight: '700',
        color: '#00c39a',
    },
    button: {
        marginTop: 16,
        backgroundColor: '#00c39a',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
    },
    emptyCard: {
        width: '100%',
        maxWidth: 520,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
    },
});