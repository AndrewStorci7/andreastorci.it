/**
 * Tiny menu on click
 * @author Andrea Storci aka dreean
 */

interface TinyMenuProps {
    visible?: boolean,
}

export default function TinyMenu({ visible = true }: TinyMenuProps) {
    return (
        <div className={`${(visible) ? "visibile" : "invisible"} tiny-menu`}>
            
        </div>
    )
}
