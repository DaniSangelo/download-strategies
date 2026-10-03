export abstract class XmlGeneratorPort {
  abstract generate(onProgress?: (percent: number) => void): Promise<string>;
}
