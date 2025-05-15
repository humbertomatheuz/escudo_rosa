import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const motivos = [
  'Ameaça',
  'Violência física',
  'Violência psicológica',
  'Violência sexual',
  'Outro',
];

const DenunciarScreen = () => {
  const [identificar, setIdentificar] = useState(true);
  const [nome, setNome] = useState('');
  const [motivo, setMotivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [agressor, setAgressor] = useState('');
  const [motivoDropdown, setMotivoDropdown] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Nome */}
      {identificar && (
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
        />
      )}

      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setIdentificar((v) => !v)}
        activeOpacity={0.8}
      >
        <View style={[styles.checkbox, identificar && styles.checkboxChecked]}>
          {identificar && <Ionicons name="checkmark" size={18} color="#fff" />}
        </View>
        <Text style={styles.checkboxLabel}>Desejo me identificar</Text>
      </TouchableOpacity>

      {/* Motivo da denúncia */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setMotivoDropdown(!motivoDropdown)}
        activeOpacity={0.8}
      >
        <Text style={{ color: motivo ? '#222' : '#B0B0B0', fontSize: 16 }}>
          {motivo || 'Motivo da denúncia *'}
        </Text>
        <Ionicons
          name={motivoDropdown ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#B0B0B0"
          style={{ position: 'absolute', right: 16, top: 18 }}
        />
      </TouchableOpacity>
      {motivoDropdown && (
        <View style={styles.dropdown}>
          {motivos.map((m) => (
            <TouchableOpacity
              key={m}
              style={styles.dropdownItem}
              onPress={() => {
                setMotivo(m);
                setMotivoDropdown(false);
              }}
            >
              <Text style={{ fontSize: 16 }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Descrição */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição *"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
      />

      {/* Identificação agressor */}
      <TextInput
        style={styles.input}
        placeholder="Identificação agressor"
        value={agressor}
        onChangeText={setAgressor}
      />

      {/* Botão Enviar */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 56 : 32,
    paddingHorizontal: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CFCFD1',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#A03A5E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#A03A5E',
    borderColor: '#A03A5E',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#A03A5E',
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CFCFD1',
    borderRadius: 12,
    marginBottom: 12,
    marginTop: -8,
    zIndex: 10,
    elevation: 4,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  button: {
    marginTop: 'auto',
    backgroundColor: '#A03A5E',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default DenunciarScreen;