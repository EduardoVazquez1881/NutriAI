import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActionSheetIOS,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const FormularioPersonal = () => {

  const router = useRouter();

  const [estatura, setEstatura] = useState('0');
  const [peso, setPeso] = useState('0');
  const [edad, setEdad] = useState('0');
  const [genero, setGenero] = useState('');

const handleSiguiente = () => {
    // Validar que el género esté seleccionado
    if (!genero) {
        alert('Por favor seleccione su género');
        return;
    }

    // Convertir a números y validar
    const estaturaNum = Number(estatura);
    const pesoNum = Number(peso);
    const edadNum = Number(edad);

    if (estaturaNum <= 0 || pesoNum <= 0 || edadNum <= 0) {
        alert('Por favor ingrese valores válidos en todos los campos');
        return;
    }

    const data = {
        estatura: estatura.toString(), // Convertir a string
        peso: peso.toString(),         // Convertir a string  
        edad: edad.toString(),         // Convertir a string
        genero: genero
    };

    console.log('Datos personales:', data);

    router.push({
        pathname: '/objetivos',
        params: data
    });
};
    return (
    // Contenedor principal con el fondo degradado y manejo de teclado
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          {/* El 'card' blanco que contiene el formulario */}
          <View style={styles.card}>
        
        {/* Título y icono (el icono sería una imagen o un componente de icono) */}
        <View style={styles.header}>
          {/* Aquí iría el componente de icono circular */}
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <Text style={styles.title}>Información Personal</Text>
          {/* Indicadores de paso (los puntos) */}
          <View style={styles.stepIndicators}>
            <View style={[styles.stepDot, styles.activeDot]} />
            <View style={styles.stepDot} />
            <View style={styles.stepDot} />
          </View>
        </View>

        {/* --- Campo Estatura --- */}
        <Text style={styles.inputLabel}>Estatura (cm)</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEstatura}
          value={estatura}
          keyboardType="numeric" // Para solo aceptar números
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          onFocus={() => { if (estatura === '0') setEstatura(''); }}
          onBlur={() => { if (estatura.trim() === '') setEstatura('0'); }}
        />

        {/* --- Campo Peso Actual --- */}
        <Text style={styles.inputLabel}>Peso Actual (kg)</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPeso}
          value={peso}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          onFocus={() => { if (peso === '0') setPeso(''); }}
          onBlur={() => { if (peso.trim() === '') setPeso('0'); }}
        />

        {/* --- Campo Edad --- */}
        <Text style={styles.inputLabel}>Edad</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEdad}
          value={edad}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          onFocus={() => { if (edad === '0') setEdad(''); }}
          onBlur={() => { if (edad.trim() === '') setEdad('0'); }}
        />
        
        {/* --- Campo Género --- */}
        <Text style={styles.inputLabel}>Género</Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            style={styles.iosPicker}
            onPress={() => {
              const options = ['Masculino', 'Femenino', 'Otro', 'Cancelar'];
              ActionSheetIOS.showActionSheetWithOptions(
                { options, cancelButtonIndex: 3 },
                (buttonIndex) => {
                  if (buttonIndex === 3) return;
                  setGenero(options[buttonIndex]);
                }
              );
            }}
          >
            <Text style={genero ? styles.iosPickerText : styles.iosPickerPlaceholder}>
              {genero || 'Selecciona Género'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={genero}
              onValueChange={(itemValue) => setGenero(itemValue)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Selecciona Género" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
          </View>
        )}

        {/* --- Botón Siguiente --- */}
        <TouchableOpacity style={styles.button} onPress={handleSiguiente}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// 3. Estilos
const styles = StyleSheet.create({
  background: {
    flex: 1,
    // Aquí puedes usar Expo LinearGradient si quieres el fondo degradado
    backgroundColor: '#F5F5F5', // Color de fondo temporal
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
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
  // --- Header/Título ---
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 191, 255, 0.2)', // Color del círculo exterior
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 30,
    color: '#00bfff', // Color del icono (ajusta si usas un icono real)
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
    backgroundColor: '#00bfff', // Color activo (azul/verde de tu imagen)
    width: 15,
  },

  // --- Inputs ---
  inputLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 5,
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
  
  // --- Picker/Selector ---
  pickerContainer: {
    height: 50,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    overflow: 'visible', // Allow dropdown to render outside the container
  },
  picker: {
    // El Picker puede ser difícil de estilizar, a veces se requieren estilos adicionales
    height: 50,
    width: '100%',
  },

  // iOS action sheet picker style
  iosPicker: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  iosPickerText: {
    color: '#000',
    fontSize: 16,
  },
  iosPickerPlaceholder: {
    color: '#888',
    fontSize: 16,
  },

  // --- Botón ---
  button: {
    marginTop: 30,
    backgroundColor: '#00c39a', // Color verde brillante
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
});

export default FormularioPersonal;