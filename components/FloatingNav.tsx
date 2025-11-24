import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconMap = Record<string, any>;

export default function FloatingNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [iconsXml, setIconsXml] = useState<IconMap>({});
  const [SvgXmlComponent, setSvgXmlComponent] = useState<any>(null);

  const INDICATOR_SIZE = 56;
  const translateX = useRef(new Animated.Value(0)).current;
  const [layouts, setLayouts] = useState<Record<string, { x: number; width: number }>>({});

  // Map logical names to svg asset modules
  const map = {
    home: require('../assets/svg/home.svg'),
    history: require('../assets/svg/history.svg'),
    progreso: require('../assets/svg/query.svg'),
    profile: require('../assets/svg/person.svg'),
  } as Record<string, any>;

  useEffect(() => {
    // dynamic require to avoid bundler error if lib not installed
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const rnSvg = require('react-native-svg');
      // SvgXml will be used to render raw svg XML
      setSvgXmlComponent(() => (rnSvg as any).SvgXml);
    } catch (e) {
      setSvgXmlComponent(null);
    }

    // load svg text for each icon
    (async () => {
      const loaded: IconMap = {};
      for (const key of Object.keys(map)) {
        try {
          const module = map[key];
          const asset = Asset.fromModule(module);
          await asset.downloadAsync();
          const uri = asset.localUri || asset.uri;
          const xml = await FileSystem.readAsStringAsync(uri || '');
          loaded[key] = xml;
        } catch (err) {
          // ignore, fall back to module require for Image
          loaded[key] = null;
        }
      }
      setIconsXml(loaded);
    })();
  }, []);

  // determine active key from pathname
  const activeKey = (() => {
    const p = pathname || '';
    if (p.includes('/home')) return 'home';
    if (p.includes('/progreso')) return 'progreso';
    if (p.includes('/historial')) return 'history';
    if (p.includes('/informacionpersonal') || p.includes('/perfil')) return 'profile';
    return 'home';
  })();

  // animate indicator when activeKey or layouts change
  useEffect(() => {
    const l = layouts[activeKey];
    if (l) {
      const target = l.x + l.width / 2 - INDICATOR_SIZE / 2;
      Animated.timing(translateX, {
        toValue: target,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [activeKey, layouts, translateX]);

  const Icon = ({ name, size = 24 }: { name: string; size?: number }) => {
    const xml = iconsXml[name];
    if (SvgXmlComponent && xml) {
      const SvgXml = SvgXmlComponent;
      return <SvgXml xml={xml} width={size} height={size} />;
    }

    // fallback: try to require a png/svg as Image (metro may support svg as image)
    try {
      const mod = map[name];
      return <Image source={mod} style={{ width: size, height: size }} resizeMode="contain" />;
    } catch (e) {
      return <View style={{ width: size, height: size }} />;
    }
  };
  const navItems = [
    { key: 'home', label: 'Inicio', route: '/home' },
    { key: 'progreso', label: 'ProgresoD', route: '/progreso' },
    { key: 'history', label: 'Historial', route: '/historial' },
    { key: 'profile', label: 'Perfil', route: '/informacionpersonal' },
  ];

  const onItemLayout = (key: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => ({ ...prev, [key]: { x, width } }));
  };

  const hasLayout = Boolean(layouts[activeKey]);

  return (
    <View style={styles.floatingNav} pointerEvents="box-none">
      {/* animated indicator (bolita) positioned absolutely inside the nav */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          {
            transform: [{ translateX }],
            opacity: hasLayout ? 1 : 0,
          },
        ]}
      />

      {navItems.map((item) => {
        const isCenter = item.key === 'progreso';
        const isActive = activeKey === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            onLayout={onItemLayout(item.key)}
            style={[styles.navButton, isCenter && styles.centerButton]}
            onPress={() => router.replace(item.route as any)}
          >
            <View style={isCenter ? styles.centerIconWrapper : undefined}>
              <Icon name={item.key === 'history' ? 'history' : item.key === 'profile' ? 'profile' : item.key} size={22} />
            </View>
            {item.label ? <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 64,
    zIndex: 2,
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  centerButton: {
    marginTop: -18,
  },
  scanWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00c39a',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    bottom: 12,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00c39a',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  centerIconWrapper: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabelActive: {
    color: '#00c39a',
    fontWeight: '600',
  },
});
