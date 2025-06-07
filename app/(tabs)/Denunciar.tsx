import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { salvarDenuncia } from '../../db/denunciaDB';
import { useRouter } from 'expo-router';
import styles from '@/styles/styles'; 

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
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();

  const handleEnviar = async () => {
    if (!motivo || !descricao) {
      Alert.alert('Atenção', 'Preencha o motivo e a descrição.');
      return;
    }
    try {
      await salvarDenuncia({
        nome: identificar ? nome : '',
        identificar,
        motivo,
        descricao,
        agressor,
        createdAt: new Date().toISOString(),
      });
      setShowPopup(true);
      setNome('');
      setMotivo('');
      setDescricao('');
      setAgressor('');
      setIdentificar(true);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a denúncia.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Popup de confirmação */}
      {showPopup && (
        <View style={styles.popup}>
          <Text style={styles.popupText}>Denúncia enviada com sucesso!</Text>
        </View>
      )}

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
      <TouchableOpacity style={styles.button} onPress={handleEnviar}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DenunciarScreen;
