import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DetallesIngredientes from '../api/promt';
import FloatingNav from '../components/FloatingNav';



const genAI = new GoogleGenerativeAI("AIzaSyBFGseKPIVCUDZYznOTX3VqyDXGqiakT4o");

export default function App() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ImagenSeleccionada, setImagenSeleccionada] = useState<string | undefined>(undefined);
  const params = useLocalSearchParams();
  const caloriasMeta = Number(params.caloriasMeta) || 2547;
  const caloriasConsumidas = 0; // placeholder, actualizar cuando haya datos reales
  const porcentaje = caloriasMeta > 0 ? Math.min(100, Math.round((caloriasConsumidas / caloriasMeta) * 100)) : 0;

  // Solicitar permisos al iniciar la app
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos permisos para acceder a tus fotos');
      }
    })();
  }, []);

  const converirImagen = async(uri: any) => {
    const trasformarImagen64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return trasformarImagen64;
  }

  const consulta = async(imagen: any) => {
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});
    const promt = DetallesIngredientes();

    const resultado = await model.generateContent([
      promt,{
        inlineData:{
          data: imagen,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const text = resultado.response.text();
    const converirJson = JSON.parse(text);
    console.log("Respuesta de gemini: " + text);
    return converirJson;

  }

const pickerimage = async () => {
  console.log("Función activada");
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Resultado:", result);

    if (!result.canceled) {
      console.log("Imagen seleccionada correctamente");
      const imageUri = result.assets[0].uri;
      setImagenSeleccionada(imageUri);

      const prueba = await converirImagen(imageUri);

      setIsLoading(true);

      const resultado = await consulta(prueba); // Llamada real

      setIsLoading(false);

      console.log("Resultado obtenido:", resultado);

      router.push({
        pathname:'/view',
        params: {data: JSON.stringify(resultado)}
      });
      
    } else {
      console.log("Selección cancelada");
    }
  } catch (error) {
    console.error("Error al seleccionar imagen:", error);
    Alert.alert("Error", "No se pudo seleccionar la imagen");
    setIsLoading(false); // Para evitar que se quede colgado
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }} contentContainerStyle={styles.scrollContent} keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>
        <View style={styles.comidaCard}>
          <View style={styles.logoLarge}>
            {ImagenSeleccionada ? (
              <Image source={{ uri: ImagenSeleccionada }} style={styles.imagenPreviewLarge} />
            ) : (
              <View style={styles.iconPlaceholderLarge}><Text style={styles.iconEmoji}>🍽️</Text></View>
            )}
          </View>
          <Text style={styles.cardTitle}>Registra tu comida</Text>
          <Text style={styles.cardSubtitle}>Toma una foto y será analizada al instante</Text>

          <TouchableOpacity onPress={pickerimage} disabled={isLoading} style={isLoading ? styles.btnWrapperDisabled : styles.btnWrapper}>
            <LinearGradient colors={isLoading ? ['#999', '#AAA'] : ['#00c39a', '#00a86b']} style={styles.btnComida} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.textoBoton}>Subir tu comida</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.ProgresoCard}>
          <View style={styles.progresoHeader}>
            <Text style={styles.TextoProgreso}>Progreso de Hoy</Text>
            <Text style={styles.percentageText}>{porcentaje}%</Text>
          </View>

          <View style={styles.caloriasRow}>
            <Text style={styles.caloriasText}>Calorías</Text>
            <Text style={styles.caloriasTextRight}>{caloriasConsumidas} / {caloriasMeta} kcal</Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${porcentaje}%` }]} />
          </View>

          <View style={styles.macroRowLarge}>
            <View style={styles.macroCardLarge}>
              <Text style={styles.macroValueLarge}>0g</Text>
              <Text style={styles.macroLabelLarge}>Proteínas</Text>
            </View>
            <View style={styles.macroCardLarge}>
              <Text style={styles.macroValueLarge}>0g</Text>
              <Text style={styles.macroLabelLarge}>Carbos</Text>
            </View>
            <View style={styles.macroCardLarge}>
              <Text style={styles.macroValueLarge}>0g</Text>
              <Text style={styles.macroLabelLarge}>Grasas</Text>
            </View>
          </View>
        </View>

        <View style={styles.motivacionCard}>
          <Text style={styles.motivacionTitle}>¡Sigue así!</Text>
          <Text style={styles.motivacionText}>Buen comienzo — cada elección cuenta. Mantén la consistencia para ver resultados.</Text>
        </View>
      </ScrollView>
          <FloatingNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', 
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 140,
  },
  comida:{
    backgroundColor: 'white',
    height: 260,
    width: '90%',
    maxWidth: 420,
    borderRadius: 10,
    shadowRadius: 10,
    shadowColor:'rgba(202, 194, 194, 1)',
    alignItems: 'center',    
  },
  logo:{
    borderRadius: 50,
    height:80,
    width: 80,
    marginTop:10,
    backgroundColor:'#f0f0f0',
    overflow: 'hidden',
  },
  imagenPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  TextoPrincipal:{ 
    marginTop:12,
    fontWeight:"bold",
    fontSize:20,
  },
  Texto:{
    fontSize:14,
    marginTop:10,
    textAlign: 'center', 
  },
  // Wrapper around the gradient/button to control layout and disabled appearance
  btnWrapper: {
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  // Slightly dimmed wrapper used when the button is disabled
  btnWrapperDisabled: {
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
    opacity: 0.7,
  },
  btnComida:{
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  textoBoton: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  Progreso:{
    backgroundColor: 'white',
    paddingVertical: 18,
    width: '90%',
    maxWidth: 420,
    borderRadius: 12,
    marginTop: 18,
    shadowRadius: 10,
    shadowColor:'rgba(202, 194, 194, 1)',
    paddingHorizontal: 18,
  },
  TextoProgreso:{ 
    marginTop:15,
    marginLeft:0,
    fontSize:15,
    fontFamily:'arial',
  },
  caloriasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  caloriasText: {
    fontSize: 14,
    color: '#666',
  },
  caloriasTextRight: {
    fontSize: 13,
    color: '#999',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00c39a',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  macroCard: {
    width: 90,
    height: 70,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValue: {
    color: '#00c39a',
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 16,
  },
  macroLabel: {
    fontSize: 12,
    color: '#888',
  },
  motivacion: {
    backgroundColor: '#eafff3',
    width: '90%',
    maxWidth: 420,
    borderRadius: 12,
    padding: 18,
    marginTop: 18,
    alignItems: 'center',
  },
  motivacionTitle: {
    fontWeight: '700',
    color: '#00a86b',
    marginBottom: 8,
    fontSize: 16,
  },
  motivacionText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  /* New styles for improved layout */
  headerBlock: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  comidaCard: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 420,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  logoLarge: {
    width: 110,
    height: 110,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imagenPreviewLarge: {
    width: '100%',
    height: '100%',
  },
  iconPlaceholderLarge: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 36,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  ProgresoCard: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 420,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 6,
  },
  progresoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00c39a',
  },
  macroRowLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  macroCardLarge: {
    width: 100,
    height: 80,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValueLarge: {
    color: '#00c39a',
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 18,
  },
  macroLabelLarge: {
    fontSize: 13,
    color: '#888',
  },
  motivacionCard: {
    backgroundColor: '#eafff3',
    width: '90%',
    maxWidth: 420,
    borderRadius: 12,
    padding: 18,
    marginTop: 18,
    alignItems: 'center',
  },
  /* Floating nav styles */
  floatingNav: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    bottom: 18,
    height: 70,
    borderRadius: 40,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
    paddingHorizontal: 12,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
  },
  navIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navIconText: {
    fontSize: 16,
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
  },
  centerButton: {
    marginTop: -18,
  },
  scanButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  scanIcon: {
    fontSize: 20,
    color: '#fff',
  },
});
