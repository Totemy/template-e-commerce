import 'reflect-metadata'
import { AppDataSource } from './database/data-source'
import { Admin } from './database/entities/Admin.entity'
import { Category } from './database/entities/Category.entity'
import { Product, Material } from './database/entities/Product.entity'
import { ProductVariant } from './database/entities/ProductVariant.entity'
import {
    Order,
    OrderStatus,
    PaymentMethod,
} from './database/entities/Order.entity'
import { OrderItem } from './database/entities/OrderItem.entity'
import * as bcrypt from 'bcrypt'

// Генератор slug
function generateSlug(text: string): string {
    const translitMap: { [key: string]: string } = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'h',
        ґ: 'g',
        д: 'd',
        е: 'e',
        є: 'ye',
        ж: 'zh',
        з: 'z',
        и: 'y',
        і: 'i',
        ї: 'yi',
        й: 'y',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'kh',
        ц: 'ts',
        ч: 'ch',
        ш: 'sh',
        щ: 'shch',
        ь: '',
        ю: 'yu',
        я: 'ya',
    }

    return text
        .toLowerCase()
        .split('')
        .map((char) => translitMap[char] || char)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// Випадкове число в діапазоні
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Випадковий елемент масиву
function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)]
}

async function seedDatabase() {
    try {
        console.log('🔌 Підключення до бази даних...')
        await AppDataSource.initialize()
        console.log('✓ Підключення до бази даних встановлено')

        // Очищення бази даних
        console.log('\n🗑️  Очищення існуючих даних...')

        // Видаляємо дані в правильному порядку (з урахуванням foreign keys)
        await AppDataSource.createQueryBuilder()
            .delete()
            .from(OrderItem)
            .execute()

        await AppDataSource.createQueryBuilder().delete().from(Order).execute()

        await AppDataSource.createQueryBuilder()
            .delete()
            .from(ProductVariant)
            .execute()

        // Для Product потрібно спочатку очиститиMany-to-Many зв'язок з категоріями
        await AppDataSource.createQueryBuilder()
            .delete()
            .from('product_categories')
            .execute()

        await AppDataSource.createQueryBuilder()
            .delete()
            .from(Product)
            .execute()

        await AppDataSource.createQueryBuilder()
            .delete()
            .from(Category)
            .execute()

        await AppDataSource.createQueryBuilder().delete().from(Admin).execute()

        console.log('✓ Дані очищено')

        // 1. Створення адміністратора
        console.log('\n👤 Створення адміністратора...')
        const adminRepo = AppDataSource.getRepository(Admin)
        const passwordHash = await bcrypt.hash('admin123', 10)

        const admin = adminRepo.create({
            email: 'admin@jewelry.com',
            passwordHash,
            name: 'Адміністратор',
        })
        await adminRepo.save(admin)
        console.log('✓ Створено адміна: admin@jewelry.com / admin123')

        // 2. Створення категорій
        console.log('\n📁 Створення категорій...')
        const categoryRepo = AppDataSource.getRepository(Category)

        const categoryData = [
            {
                name: 'Каблучки',
                description: 'Елегантні каблучки з різних матеріалів',
                imageUrl:
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
            },
            {
                name: 'Обручки',
                description: 'Весільні та помолвочні обручки',
                imageUrl:
                    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
            },
            {
                name: 'Сережки',
                description: 'Вишукані сережки на будь-який смак',
                imageUrl:
                    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
            },
            {
                name: 'Підвіски',
                description: 'Красиві підвіски та медальйони',
                imageUrl:
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
            },
            {
                name: 'Браслети',
                description: 'Стильні браслети різних дизайнів',
                imageUrl:
                    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
            },
            {
                name: 'Намиста',
                description: 'Розкішні намиста з дорогоцінних металів',
                imageUrl:
                    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e',
            },
        ]

        const categories: Category[] = []
        for (let i = 0; i < categoryData.length; i++) {
            const data = categoryData[i]
            const category = categoryRepo.create({
                name: data.name,
                slug: generateSlug(data.name),
                description: data.description,
                imageUrl: data.imageUrl,
                displayOrder: i + 1,
                isActive: true,
            })
            categories.push(await categoryRepo.save(category))
        }
        console.log(`✓ Створено ${categories.length} категорій`)

        // 3. Створення продуктів
        console.log('\n💍 Створення продуктів...')
        const productRepo = AppDataSource.getRepository(Product)
        const variantRepo = AppDataSource.getRepository(ProductVariant)

        const productTemplates = [
            // Каблучки
            {
                name: 'Каблучка "Вікторія"',
                category: categories[0],
                material: Material.SILVER_925,
                price: 1200,
                weight: 3.5,
                variants: ['16', '17', '18', '19', '20'],
            },
            {
                name: 'Каблучка "Елегант"',
                category: categories[0],
                material: Material.GOLD_585,
                price: 8500,
                compareAtPrice: 9500,
                weight: 4.2,
                variants: ['15', '16', '17', '18', '19'],
            },
            {
                name: 'Каблучка з цирконієм',
                category: categories[0],
                material: Material.SILVER_925,
                price: 1800,
                weight: 4.0,
                variants: ['16', '17', '18', '19'],
            },
            {
                name: 'Каблучка "Класика"',
                category: categories[0],
                material: Material.GOLD_750,
                price: 12000,
                weight: 5.0,
                variants: ['16', '17', '18', '19', '20', '21'],
            },

            // Обручки
            {
                name: 'Обручка "Назавжди"',
                category: categories[1],
                material: Material.GOLD_585,
                price: 7200,
                weight: 3.8,
                variants: ['15', '16', '17', '18', '19', '20'],
            },
            {
                name: 'Обручка "Вічність"',
                category: categories[1],
                material: Material.PLATINUM,
                price: 15000,
                compareAtPrice: 17000,
                weight: 6.0,
                variants: ['16', '17', '18', '19', '20'],
            },
            {
                name: 'Обручка класична',
                category: categories[1],
                material: Material.GOLD_585,
                price: 6500,
                weight: 3.2,
                variants: ['15', '16', '17', '18', '19'],
            },
            {
                name: 'Обручка з гравіюванням',
                category: categories[1],
                material: Material.GOLD_750,
                price: 13500,
                weight: 4.5,
                variants: ['16', '17', '18', '19', '20'],
            },

            // Сережки
            {
                name: 'Сережки "Діаманти"',
                category: categories[2],
                material: Material.SILVER_925,
                price: 2100,
                weight: 2.5,
                variants: ['Стандарт'],
            },
            {
                name: 'Сережки "Краплі"',
                category: categories[2],
                material: Material.GOLD_585,
                price: 9500,
                weight: 3.8,
                variants: ['Стандарт'],
            },
            {
                name: 'Сережки-гвоздики',
                category: categories[2],
                material: Material.SILVER_925,
                price: 1500,
                compareAtPrice: 1800,
                weight: 1.8,
                variants: ['Стандарт'],
            },
            {
                name: 'Сережки "Кільця великі"',
                category: categories[2],
                material: Material.GOLD_585,
                price: 8200,
                weight: 4.2,
                variants: ['Маленькі', 'Середні', 'Великі'],
            },

            // Підвіски
            {
                name: 'Підвіска "Серце"',
                category: categories[3],
                material: Material.SILVER_925,
                price: 1400,
                weight: 2.2,
                variants: ['Стандарт'],
            },
            {
                name: 'Підвіска "Хрестик"',
                category: categories[3],
                material: Material.GOLD_585,
                price: 5500,
                weight: 2.8,
                variants: ['Маленький', 'Середній', 'Великий'],
            },
            {
                name: 'Підвіска з фіанітом',
                category: categories[3],
                material: Material.SILVER_925,
                price: 1900,
                compareAtPrice: 2300,
                weight: 2.5,
                variants: ['Стандарт'],
            },

            // Браслети
            {
                name: 'Браслет "Ланцюжок"',
                category: categories[4],
                material: Material.SILVER_925,
                price: 2800,
                weight: 8.5,
                variants: ['18см', '19см', '20см'],
            },
            {
                name: 'Браслет "Панцир"',
                category: categories[4],
                material: Material.GOLD_585,
                price: 12500,
                weight: 12.0,
                variants: ['18см', '19см', '20см', '21см'],
            },
            {
                name: 'Браслет з підвісками',
                category: categories[4],
                material: Material.SILVER_925,
                price: 3200,
                weight: 9.2,
                variants: ['18см', '19см', '20см'],
            },

            // Намиста
            {
                name: 'Намисто "Венеція"',
                category: categories[5],
                material: Material.SILVER_925,
                price: 4500,
                weight: 15.0,
                variants: ['45см', '50см', '55см'],
            },
            {
                name: 'Намисто "Королева"',
                category: categories[5],
                material: Material.GOLD_585,
                price: 18000,
                compareAtPrice: 20000,
                weight: 18.5,
                variants: ['45см', '50см'],
            },
        ]

        const products: Product[] = []

        for (const template of productTemplates) {
            const images = [
                {
                    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
                    altText: `${template.name} - основне фото`,
                },
                {
                    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
                    altText: `${template.name} - деталі`,
                },
                {
                    url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
                    altText: `${template.name} - на моделі`,
                },
            ]

            const product = productRepo.create({
                name: template.name,
                slug: generateSlug(template.name),
                description: `Вишукана біжутерія "${template.name}" виготовлена з високоякісного матеріалу. Ідеально підходить як для повсякденного носіння, так і для особливих випадків. Кожен виріб проходить ретельний контроль якості.`,
                price: template.price,
                compareAtPrice: template.compareAtPrice,
                weight: template.weight,
                material: template.material,
                images: images,
                isAvailable: true,
                isFeatured: Math.random() > 0.7,
                isNewArrival: Math.random() > 0.6,
                categories: [template.category],
            })

            const savedProduct = await productRepo.save(product)

            // Створення варіантів
            for (const variantName of template.variants) {
                const variant = variantRepo.create({
                    productId: savedProduct.id,
                    product: savedProduct,
                    name: variantName,
                    priceAdjustment: 0,
                    stockQuantity: randomInt(5, 50),
                    isAvailable: true,
                })
                await variantRepo.save(variant)
            }

            products.push(savedProduct)
        }

        console.log(`✓ Створено ${products.length} продуктів`)

        // 4. Створення замовлень
        console.log('\n📦 Створення замовлень...')
        const orderRepo = AppDataSource.getRepository(Order)
        const orderItemRepo = AppDataSource.getRepository(OrderItem)

        const names = [
            'Олена Коваленко',
            'Іван Мельник',
            'Марія Шевченко',
            'Андрій Бондаренко',
            'Наталія Кравченко',
        ]
        const cities = [
            'Київ',
            'Львів',
            'Одеса',
            'Харків',
            'Дніпро',
            'Запоріжжя',
        ]
        const statuses = [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPED,
            OrderStatus.DELIVERED,
        ]

        for (let i = 0; i < 15; i++) {
            const orderProducts: Array<{
                product: Product
                variant: ProductVariant
                quantity: number
            }> = []
            const numItems = randomInt(1, 3)

            for (let j = 0; j < numItems; j++) {
                const product = randomElement(products)
                const productWithVariants = await productRepo.findOne({
                    where: { id: product.id },
                    relations: ['variants'],
                })

                if (
                    productWithVariants &&
                    productWithVariants.variants.length > 0
                ) {
                    orderProducts.push({
                        product: productWithVariants,
                        variant: randomElement(productWithVariants.variants),
                        quantity: randomInt(1, 2),
                    })
                }
            }

            let subtotal = 0
            const orderItems: OrderItem[] = []

            for (const item of orderProducts) {
                const itemPrice = parseFloat(item.product.price.toString())
                const itemSubtotal = itemPrice * item.quantity
                subtotal += itemSubtotal

                const orderItem = orderItemRepo.create({
                    product: item.product,
                    variantId: item.variant.id,
                    productSnapshot: {
                        name: item.product.name,
                        sku: `SKU-${item.product.id.substring(0, 8)}`,
                        price: itemPrice,
                        image: item.product.images[0]?.url || '',
                    },
                    quantity: item.quantity,
                    price: itemPrice,
                    subtotal: itemSubtotal,
                })
                orderItems.push(orderItem)
            }

            const shippingCost = subtotal > 5000 ? 0 : 100
            const total = subtotal + shippingCost

            const customerName = randomElement(names)
            const order = orderRepo.create({
                orderNumber: `ORD-${Date.now()}-${i}`,
                customerName: customerName,
                customerEmail:
                    customerName.split(' ')[0].toLowerCase() + '@example.com',
                customerPhone: `+380${randomInt(50, 99)}${randomInt(1000000, 9999999)}`,
                status: randomElement(statuses),
                paymentMethod:
                    Math.random() > 0.5
                        ? PaymentMethod.CARD
                        : PaymentMethod.CASH_ON_DELIVERY,
                subtotal: subtotal,
                shippingCost: shippingCost,
                total: total,
                shippingAddress: {
                    city: randomElement(cities),
                    address: `вул. Хрещатик, ${randomInt(1, 100)}`,
                    postalCode: `0${randomInt(1000, 9999)}`,
                },
                customerNotes:
                    Math.random() > 0.5
                        ? 'Будь ласка, зателефонуйте перед доставкою'
                        : undefined,
                trackingNumber:
                    Math.random() > 0.3
                        ? `TRK${randomInt(100000000, 999999999)}`
                        : undefined,
            })

            const savedOrder = await orderRepo.save(order)

            for (const item of orderItems) {
                item.order = savedOrder
                await orderItemRepo.save(item)
            }
        }

        console.log('✓ Створено 15 замовлень')

        console.log('\n✅ База даних успішно заповнена!')
        console.log('\n📊 Підсумок:')
        console.log(`   - Адміністраторів: 1`)
        console.log(`   - Категорій: ${categories.length}`)
        console.log(`   - Продуктів: ${products.length}`)
        console.log(`   - Замовлень: 15`)
        console.log('\n💡 Дані для входу:')
        console.log('   Email: admin@jewelry.com')
        console.log('   Password: admin123')
    } catch (error) {
        console.error('❌ Помилка:', error)
    } finally {
        await AppDataSource.destroy()
    }
}

seedDatabase()
