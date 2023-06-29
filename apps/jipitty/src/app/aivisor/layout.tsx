export default async function AivisorLayout(
	props: React.PropsWithChildren<{}>
) {
	return <div className="relative bg-gray-800">{props.children}</div>
}
